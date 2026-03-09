from sqlalchemy import Column, Integer, ForeignKey,Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Reviews(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rating = Column(Integer, nullable=False) 
    text = Column(Text, nullable=True)    


    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="reviews")


    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    event = relationship("Event", back_populates="reviews")