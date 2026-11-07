import React, { useState, useEffect } from "react";
import { Wallet, ArrowDownCircle, ArrowUpCircle, ShoppingCart, History, RotateCcw } from "lucide-react";
import "./bank-demo.css";

const KEY = "tazapolos-banco-demo-v1";
const DEFAULT = { balance: 0, history: [] };
const soles = cents => "S/ " + (cents / 100).toFixed(2);

export default function BankDemo() {
  const [account, setAccount] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return saved && Number.isSafeInteger(saved.balance) &&
        saved.balance >= 0 && Array.isArray(saved.history)
        ? saved : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  const [amount, setAmount] = useState("50");
  const [price, setPrice] = useState("12");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(account));
    } catch {}
  }, [account]);

  function movement(type, value, description) {
    setAccount(previous => ({
      balance: previous.balance + value,
      history: [{
        id: Date.now() + Math.random(),
        type,
        value,
        description,
        date: new Date().toLocaleString("es-PE")
      }, ...previous.history].slice(0, 50)
    }));
  }

  function deposit() {
    const number = Number(amount);
    const cents = Math.round(number * 100);

    if (!Number.isFinite(number) || number < 10 ||
        !Number.isSafeInteger(cents)) {
      setMessage("El depósito mínimo es S/ 10.00.");
      return;
    }

    const commission = Math.round(cents * 0.02);
    const received = cents - commission;

    if (!Number.isSafeInteger(account.balance + received)) {
      setMessage("El monto supera el límite del simulador.");
      return;
    }

    movement("Depósito", received,
      "Comisión del 2%: " + soles(commission));
    setMessage("Depósito realizado correctamente.");
  }

  function withdraw() {
    const number = Number(amount);
    const cents = Math.round(number * 100);

    if (!Number.isFinite(number) || number <= 0 ||
        !Number.isSafeInteger(cents) || cents <= 0) {
      setMessage("Ingresa un monto válido.");
      return;
    }

    if (cents > account.balance) {
      setMessage("Retiro rechazado: fondos insuficientes.");
      return;
    }

    movement("Retiro", -cents, "Retiro de dinero");
    setMessage("Retiro realizado correctamente.");
  }

  function buy() {
    const unit = Number(price);
    const qty = Number(quantity);
    const unitCents = Math.round(unit * 100);
    const total = unitCents * qty;

    if (!Number.isFinite(unit) || unit <= 0 ||
        !Number.isSafeInteger(unitCents) ||
        !Number.isInteger(qty) || qty <= 0 ||
        !Number.isSafeInteger(total) || total <= 0) {
      setMessage("Ingresa un precio y cantidad válidos.");
      return;
    }

    if (total > account.balance) {
      setMessage("Compra rechazada: fondos insuficientes.");
      return;
    }

    movement("Compra", -total, qty + " producto(s)");
    setMessage("Compra de prueba realizada correctamente.");
  }

  function reset() {
    if (window.confirm("¿Reiniciar la cuenta de demostración?")) {
      setAccount({ balance: 0, history: [] });
      setMessage("Simulación reiniciada.");
    }
  }

  return (
    <section className="wrap section bank-page">
      <div className="bank-heading">
        <span className="eyebrow">SIMULADOR FINANCIERO</span>
        <h1>Banco Virtual</h1>
        <p>Practica depósitos, retiros y compras sin utilizar dinero real.</p>
      </div>

      <div className="bank-layout">
        <div className="bank-balance">
          <div className="bank-balance-top">
            <Wallet size={30}/>
            <span>CUENTA DEMO</span>
          </div>
          <p>Saldo disponible</p>
          <h2>{soles(account.balance)}</h2>
          <div className="bank-status">● Simulación activa</div>
          <small>No representa una cuenta bancaria real.</small>
        </div>

        <div className="bank-panel">
          <h2>Realizar movimientos</h2>
          <label>Monto en soles</label>
          <input
            type="number"
            className="bank-input"
            min="0"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <div className="bank-buttons">
            <button onClick={deposit}>
              <ArrowDownCircle size={20}/> Depositar
            </button>
            <button onClick={withdraw}>
              <ArrowUpCircle size={20}/> Retirar
            </button>
          </div>

          <p className="bank-hint">
            Los depósitos tienen una comisión de 2%.
          </p>

          <h3>Simular una compra</h3>
          <div className="bank-inputs">
            <label>
              Precio (S/)
              <input
                className="bank-input"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </label>
            <label>
              Cantidad
              <input
                className="bank-input"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </label>
          </div>

          <button className="bank-purchase" onClick={buy}>
            <ShoppingCart size={19}/> Simular compra
          </button>

          {message && <p className="bank-message" role="status">{message}</p>}
        </div>
      </div>

      <div className="bank-history">
        <div className="bank-history-top">
          <h2><History size={22}/> Historial de movimientos</h2>
          <button onClick={reset}>
            <RotateCcw size={16}/> Reiniciar
          </button>
        </div>

        {account.history.length === 0 ? (
          <p className="bank-empty">Todavía no hay movimientos.</p>
        ) : (
          account.history.map(item => (
            <div className="bank-movement" key={item.id}>
              <div>
                <strong>{item.type}</strong>
                <small>{item.description} · {item.date}</small>
              </div>
              <b className={item.value >= 0 ? "bank-positive" : "bank-negative"}>
                {item.value >= 0 ? "+" : "-"}{soles(Math.abs(item.value))}
              </b>
            </div>
          ))
        )}
      </div>

      <p className="bank-disclaimer">
        Proyecto educativo. No admite tarjetas, depósitos ni transferencias reales.
        Los movimientos se guardan únicamente en este navegador.
      </p>
    </section>
  );
}