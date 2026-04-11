import os
import sys
import time

from sqlalchemy import create_engine, text


def _build_database_url() -> str:
    url = os.getenv("DATABASE_URL") or os.getenv("SQLALCHEMY_DATABASE_URL")
    if url:
        return url

    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST")
    port = os.getenv("POSTGRES_PORT")
    database = os.getenv("POSTGRES_DB")

    missing = [
        name
        for name, value in {
            "POSTGRES_USER": user,
            "POSTGRES_PASSWORD": password,
            "POSTGRES_HOST": host,
            "POSTGRES_PORT": port,
            "POSTGRES_DB": database,
        }.items()
        if not value
    ]

    if missing:
        raise RuntimeError(
            "Missing required environment variables for DB connection: "
            + ", ".join(missing)
        )

    return f"postgresql://{user}:{password}@{host}:{port}/{database}"


def wait_for_db(timeout_seconds: int = 60) -> None:
    database_url = _build_database_url()
    engine = create_engine(database_url, pool_pre_ping=True)

    deadline = time.time() + timeout_seconds
    last_exc: Exception | None = None

    while time.time() < deadline:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            time.sleep(1)

    raise TimeoutError(
        f"Database not ready after {timeout_seconds}s. Last error: {last_exc!r}"
    )


if __name__ == "__main__":
    try:
        wait_for_db(timeout_seconds=int(os.getenv("DB_WAIT_TIMEOUT", "60")))
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
