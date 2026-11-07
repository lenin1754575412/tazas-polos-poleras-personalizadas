(function () {
  const whatsapp = "51951527185";

  const css = document.createElement("style");
  css.textContent = `
    #yape-open {
      position:fixed;bottom:25px;right:25px;
      background:#8300ad;color:white;border:0;
      padding:15px 23px;border-radius:30px;
      font-weight:800;cursor:pointer;z-index:9998;
      box-shadow:0 8px 30px #0005;
    }
    #yape-overlay {
      display:none;position:fixed;inset:0;
      background:#000b;z-index:9999;
      align-items:center;justify-content:center;
      padding:15px;overflow:auto;
    }
    #yape-panel {
      background:#172b35;color:white;
      padding:25px;border-radius:20px;
      max-width:430px;width:100%;
      max-height:95vh;overflow:auto;
      font-family:Arial,sans-serif;
    }
    #yape-panel h2 {text-align:center;margin:8px 0}
    #yape-panel label {display:block;margin-top:12px}
    #yape-panel input {
      width:100%;padding:12px;margin-top:6px;
      background:#0c1a22;color:white;
      border:1px solid #456;border-radius:9px;
      box-sizing:border-box;
    }
    #yape-panel button {
      padding:13px;border:0;border-radius:9px;
      cursor:pointer;font-weight:bold;
    }
    #yape-send {background:#15a5ad;color:white;width:100%;margin-top:15px}
    #yape-close {background:#344955;color:white}
    #yape-panel img {display:block;width:230px;max-width:100%;margin:15px auto}
    #yape-panel small {color:#cbd5e1;line-height:1.5}
  `;
  document.head.appendChild(css);

  const container = document.createElement("div");
  container.innerHTML = `
    <button id="yape-open" type="button">Pagar con Yape</button>
    <div id="yape-overlay">
      <div id="yape-panel" role="dialog" aria-modal="true" aria-label="Pago con Yape">
        <button id="yape-close" type="button">Cerrar</button>
        <h2>Pago con Yape</h2>
        <p style="text-align:center">Taza&Polos</p>
        <img src="/yape-qr.png" alt="QR de Yape del vendedor">
        <p style="text-align:center">Escanea el QR y realiza tu pago.</p>
        <label>Nombre del cliente
          <input id="yape-name" placeholder="Nombre completo">
        </label>
        <label>Numero de pedido
          <input id="yape-order" placeholder="Ejemplo: PED-001">
        </label>
        <label>Monto pagado (S/)
          <input id="yape-amount" type="number" min="0.01" step="0.01" placeholder="12.00">
        </label>
        <label>Numero de operacion (opcional)
          <input id="yape-operation" placeholder="Operacion de Yape">
        </label>
        <button id="yape-send" type="button">Enviar datos por WhatsApp</button>
        <p><small>
          El pedido quedara pendiente hasta que el vendedor confirme
          el ingreso en su propia aplicacion Yape.
          No se aceptan capturas como confirmacion automatica.
        </small></p>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const overlay = document.getElementById("yape-overlay");
  document.getElementById("yape-open").onclick = () => {
    overlay.style.display = "flex";
  };
  document.getElementById("yape-close").onclick = () => {
    overlay.style.display = "none";
  };
  overlay.onclick = e => {
    if (e.target === overlay) overlay.style.display = "none";
  };

  document.getElementById("yape-send").onclick = () => {
    const name = document.getElementById("yape-name").value.trim();
    const order = document.getElementById("yape-order").value.trim();
    const amount = Number(document.getElementById("yape-amount").value);
    const operation = document.getElementById("yape-operation").value.trim();

    if (!name || !order || !Number.isFinite(amount) || amount <= 0) {
      alert("Completa nombre, pedido y monto valido.");
      return;
    }

    const message =
      "NUEVO AVISO DE PAGO - TAZA&POLOS\n" +
      "Cliente: " + name + "\n" +
      "Pedido: " + order + "\n" +
      "Monto declarado: S/ " + amount.toFixed(2) + "\n" +
      "Operacion: " + (operation || "No indicada") + "\n" +
      "Estado: PENDIENTE DE VERIFICACION\n" +
      "Por favor, verifica el ingreso en tu Yape.";

    window.open(
      "https://wa.me/" + whatsapp +
      "?text=" + encodeURIComponent(message),
      "_blank",
      "noopener,noreferrer"
    );
  };
})();