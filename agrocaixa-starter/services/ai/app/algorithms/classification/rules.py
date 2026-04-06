REGRAS_CATEGORIAS = {
    "combustivel": ["posto", "gasolina", "diesel", "etanol"],
    "insumos": ["adubo", "fertilizante", "defensivo", "semente", "calcario"],
    "racao": ["racao", "ração", "farelo", "silagem"],
    "manutencao": ["mecanica", "mecânica", "oficina", "peca", "peça", "conserto"],
    "energia": ["energia", "cemig", "eletricidade", "luz"],
    "agua": ["agua", "água"],
    "mao_de_obra": ["diaria", "diária", "funcionario", "funcionário", "pagamento trabalhador"],
}


def categorizar_despesa_por_regra(texto: str) -> str:
    if not texto:
        return "outros"

    texto_normalizado = texto.lower().strip()

    for categoria, palavras in REGRAS_CATEGORIAS.items():
        for palavra in palavras:
            if palavra in texto_normalizado:
                return categoria

    return "outros"
