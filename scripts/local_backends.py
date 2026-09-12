"""Local stand-ins for Supabase, so the pipeline can be run end-to-end
without a Supabase project.

`PostgresBackend` implements the small slice of the supabase-py fluent API
that this codebase actually uses, backed by a real Postgres database - so a
demo run exercises the real schema, real constraints, and real views, not a
mock. `LocalFileStorage` does the same for Supabase Storage using a
directory on disk.

This is demo/dev tooling. Production still uses the real Supabase client via
app.core.supabase_client.
"""

from __future__ import annotations

import shutil
import uuid
from pathlib import Path
from types import SimpleNamespace
from typing import Any

import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb


def _jsonify(value: Any) -> Any:
    """Postgres returns uuid/Decimal objects; the Pydantic response models
    declare plain strings, so normalise on the way out."""
    if isinstance(value, uuid.UUID):
        return str(value)
    return value


def _adapt(value: Any) -> Any:
    """dict/list values target jsonb columns (e.g. call_outcomes.raw_output);
    psycopg needs them wrapped. The real Supabase client does this itself."""
    if isinstance(value, (dict, list)):
        return Jsonb(value)
    return value


class _Query:
    def __init__(self, conn: psycopg.Connection, table: str):
        self._conn = conn
        self._table = table
        self._columns = "*"
        self._filters: list[tuple[str, Any]] = []
        self._insert: dict | None = None
        self._update: dict | None = None
        self._limit: int | None = None
        self._offset: int | None = None
        self._order: tuple[str, bool] | None = None

    def select(self, columns: str = "*", *_a, **_kw) -> "_Query":
        self._columns = columns or "*"
        return self

    def insert(self, payload: dict) -> "_Query":
        self._insert = payload
        return self

    def update(self, payload: dict) -> "_Query":
        self._update = payload
        return self

    def eq(self, column: str, value: Any) -> "_Query":
        self._filters.append((column, value))
        return self

    def limit(self, n: int) -> "_Query":
        self._limit = n
        return self

    def range(self, start: int, end: int) -> "_Query":
        """supabase-py's range() is an inclusive row window."""
        self._offset = start
        self._limit = end - start + 1
        return self

    def order(self, column: str, desc: bool = False) -> "_Query":
        self._order = (column, desc)
        return self

    def _where(self) -> tuple[str, list[Any]]:
        if not self._filters:
            return "", []
        clauses = " AND ".join(f"{col} = %s" for col, _ in self._filters)
        return f" WHERE {clauses}", [val for _, val in self._filters]

    def execute(self) -> SimpleNamespace:
        with self._conn.cursor(row_factory=dict_row) as cur:
            if self._insert is not None:
                cols = list(self._insert.keys())
                placeholders = ", ".join(["%s"] * len(cols))
                sql = (
                    f"INSERT INTO {self._table} ({', '.join(cols)}) "
                    f"VALUES ({placeholders}) RETURNING *"
                )
                cur.execute(sql, [_adapt(self._insert[c]) for c in cols])

            elif self._update is not None:
                cols = list(self._update.keys())
                assignments = ", ".join(f"{c} = %s" for c in cols)
                where_sql, where_params = self._where()
                sql = f"UPDATE {self._table} SET {assignments}{where_sql} RETURNING *"
                cur.execute(sql, [_adapt(self._update[c]) for c in cols] + where_params)

            else:
                where_sql, where_params = self._where()
                sql = f"SELECT {self._columns} FROM {self._table}{where_sql}"
                if self._order:
                    column, desc = self._order
                    sql += f" ORDER BY {column} {'DESC' if desc else 'ASC'}"
                if self._limit is not None:
                    sql += f" LIMIT {int(self._limit)}"
                if self._offset:
                    sql += f" OFFSET {int(self._offset)}"
                cur.execute(sql, where_params)

            rows = cur.fetchall() if cur.description else []

        self._conn.commit()
        return SimpleNamespace(data=[{k: _jsonify(v) for k, v in r.items()} for r in rows])


class LocalFileStorage:
    """Filesystem stand-in for a Supabase Storage bucket."""

    def __init__(self, root: Path):
        self._root = root

    def from_(self, _bucket: str) -> "LocalFileStorage":
        return self

    def upload(self, path: str, content: bytes, options: dict | None = None):
        target = self._root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
        return {"path": path}

    def download(self, path: str) -> bytes:
        target = self._root / path
        if not target.exists():
            raise FileNotFoundError(f"Object not found: {path}")
        return target.read_bytes()


class PostgresBackend:
    """Supabase-client-shaped facade over a real Postgres connection."""

    def __init__(self, dsn: str, storage_root: Path):
        self._conn = psycopg.connect(dsn)
        self.storage = LocalFileStorage(storage_root)

    def table(self, name: str) -> _Query:
        return _Query(self._conn, name)

    def sql(self, query: str) -> list[dict]:
        """Escape hatch for the demo to read the derived views directly."""
        with self._conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query)
            return [{k: _jsonify(v) for k, v in r.items()} for r in cur.fetchall()]

    def close(self) -> None:
        self._conn.close()


def reset_storage_dir(path: Path) -> Path:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)
    return path
