from pathlib import Path

raiz = Path("src")

reemplazos = {
    "Ã¡": "á",
    "Ã©": "é",
    "Ã­": "í",
    "Ã³": "ó",
    "Ãº": "ú",
    "Ã±": "ñ",
    "ÃA": "Á",
    "Ã‰": "É",
    "ÃM": "Í",
    "Ã“": "Ó",
    "Ãš": "Ú",
    "Ã‘": "Ñ",
    "Â¿": "¿",
    "Â¡": "¡",
    "Â·": "·",
    "â€¢": "•",
    "âœ¨": "✨",
    "âœ“": "✓",
    "â€”": "—",
    "â€“": "–"
}

archivos = 0

for archivo in raiz.rglob("*"):
    if archivo.suffix not in (".jsx", ".js", ".tsx", ".ts", ".css"):
        continue

    texto = archivo.read_text(encoding="utf-8-sig")
    original = texto

    for malo, bueno in reemplazos.items():
        texto = texto.replace(malo, bueno)

    if texto != original:
        archivo.write_text(texto, encoding="utf-8")
        archivos += 1

print(f"Archivos corregidos: {archivos}")
