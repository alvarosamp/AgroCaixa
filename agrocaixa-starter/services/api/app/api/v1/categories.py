from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.category import Category
from app.db import SessionLocal
from app.schemas.category import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])

#Obtendo sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CategoryResponse | List[CategoryResponse], status_code=201)
def create_category(
    category: CategoryCreate | List[CategoryCreate],
    db: Session = Depends(get_db),
) -> CategoryResponse | List[CategoryResponse]:
    # Bulk mode: accepts a JSON array and behaves like an idempotent seed.
    if isinstance(category, list):
        if not category:
            return []

        requested_names = [c.name for c in category]

        existing = (
            db.query(Category)
            .filter(Category.name.in_(requested_names))
            .all()
        )
        existing_by_name = {c.name: c for c in existing}

        to_create = [
            Category(name=name)
            for name in requested_names
            if name not in existing_by_name
        ]

        if to_create:
            db.add_all(to_create)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
                # In case of a race/duplicate, re-fetch and continue.
                existing = (
                    db.query(Category)
                    .filter(Category.name.in_(requested_names))
                    .all()
                )
                existing_by_name = {c.name: c for c in existing}
            else:
                for created in to_create:
                    db.refresh(created)
                    existing_by_name[created.name] = created

        return [existing_by_name[name] for name in requested_names]

    # Single mode: keep strict behavior (409 on duplicates)
    existing = db.query(Category).filter(Category.name == category.name).first()
    if existing is not None:
        raise HTTPException(status_code=409, detail="Category already exists")

    db_category = Category(name=category.name)
    db.add(db_category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Category already exists")

    db.refresh(db_category)
    return db_category

@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)) -> List[CategoryResponse]:
    categories = db.query(Category).all()
    return categories
