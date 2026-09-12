"""A minimal in-memory stand-in for the Supabase Python client, covering
only the query shapes this codebase actually uses (select/insert/update,
eq/order/limit, plus a no-op storage bucket). Good enough to run the real
pipeline code end-to-end in tests without a live Supabase project or
network access - only the external Sarvam calls still need mocking.
"""

import uuid
from types import SimpleNamespace


class _FakeStorageBucket:
    """Round-trips bytes through an in-memory dict, so upload/download
    behaves like real object storage (a download of something never
    uploaded raises, as it would against Supabase)."""

    def __init__(self, objects: dict[str, bytes]):
        self._objects = objects

    def upload(self, path: str, content: bytes, options: dict | None = None):
        self._objects[path] = content
        return {"path": path}

    def download(self, path: str) -> bytes:
        if path not in self._objects:
            raise KeyError(f"Object not found: {path}")
        return self._objects[path]


class _FakeStorage:
    def __init__(self):
        self._buckets: dict[str, dict[str, bytes]] = {}

    def from_(self, bucket: str) -> _FakeStorageBucket:
        return _FakeStorageBucket(self._buckets.setdefault(bucket, {}))


class _QueryBuilder:
    def __init__(self, rows: list[dict]):
        self._rows = rows
        self._filters: list[tuple[str, object]] = []
        self._insert_payload: dict | None = None
        self._update_payload: dict | None = None
        self._limit: int | None = None
        self._order: tuple[str, bool] | None = None

    def select(self, *_args, **_kwargs) -> "_QueryBuilder":
        return self

    def insert(self, payload: dict) -> "_QueryBuilder":
        self._insert_payload = payload
        return self

    def update(self, payload: dict) -> "_QueryBuilder":
        self._update_payload = payload
        return self

    def eq(self, column: str, value: object) -> "_QueryBuilder":
        self._filters.append((column, value))
        return self

    def limit(self, n: int) -> "_QueryBuilder":
        self._limit = n
        return self

    def order(self, column: str, desc: bool = False) -> "_QueryBuilder":
        self._order = (column, desc)
        return self

    def _matches(self, row: dict) -> bool:
        return all(row.get(col) == val for col, val in self._filters)

    def execute(self) -> SimpleNamespace:
        if self._insert_payload is not None:
            row = dict(self._insert_payload)
            row.setdefault("id", str(uuid.uuid4()))
            self._rows.append(row)
            return SimpleNamespace(data=[row])

        if self._update_payload is not None:
            updated = [row for row in self._rows if self._matches(row)]
            for row in updated:
                row.update(self._update_payload)
            return SimpleNamespace(data=updated)

        results = [row for row in self._rows if self._matches(row)]
        if self._order is not None:
            column, desc = self._order
            results = sorted(results, key=lambda r: r.get(column) or "", reverse=desc)
        if self._limit is not None:
            results = results[: self._limit]
        return SimpleNamespace(data=results)


class FakeSupabase:
    def __init__(self):
        self._store: dict[str, list[dict]] = {}
        self.storage = _FakeStorage()

    def table(self, name: str) -> _QueryBuilder:
        return _QueryBuilder(self._store.setdefault(name, []))
