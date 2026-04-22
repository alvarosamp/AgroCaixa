from sqlachemy import Column, Integer, String, DateTime, Boolean
from sqlachemy  import relationship
from app.db import Base

class AlertaFinancial(Base):
    __tablename__ = 'alerta_financial'

    id = Column(Integer, primary_key=True, index=True) #id do alerta
    user_id = Column(Integer, index=True)#id do usuário
    message = Column(String, index=True)
    date = Column(DateTime)
    read = Column(Boolean, default=False)
    type = Column(String) #expensive, income, category
    #Tentando identificar alertas iguais para evitar alertas repetidos, ex: gasto acima de 1000, gasto acima de 1000, etc
    key = Column(String, index = True) #chave para identificar o alerta, ex: categoria, valor, etc

