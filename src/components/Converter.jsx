import React, { useEffect, useState } from "react";
import "../styles/Converter.css";

const optionByConverter = {
  time: ["seconds", "minutes", "hours", "days", "weeks", "months", "years"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  money: ["cop", "usd", "eur"],
  units: ["gramos", "kilos", "libra"],
};

export default function App() {
  const [converter, setConverter] = useState("time");
  const [from, setFrom] = useState("seconds");
  const [to, setTo] = useState("seconds");
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(optionByConverter["time"]);
  const [resultado, setResultado] = useState("");

  // Cuando cambie el tipo de conversión, actualizamos las opciones
  useEffect(() => {
    const newOptions = optionByConverter[converter];
    setOptions(newOptions);
    setFrom(newOptions[0]);
    setTo(newOptions[0]);
  }, [converter]);

  // Manejo de la solicitud de conversión
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3500/v1/converter/${converter}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          value,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error en la API: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Respuesta del servidor:", responseData);

      setResultado(responseData.resultado);
    } catch (error) {
      console.error("Error:", error);
      setResultado("Hubo un error al realizar la conversión.");
    }
  }

  return (
    <div className="app">
      <h1>Convertidor General</h1>

      <form onSubmit={handleSubmit} className="converter-form">
        {/* Seleccionar tipo de conversión */}
        <label>
          Tipo de conversión:
          <select value={converter} onChange={(e) => setConverter(e.target.value)}>
            {Object.keys(optionByConverter).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Selección de opción "from" */}
        <label>
          De:
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Selección de opción "to" */}
        <label>
          A:
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Campo de entrada para el valor */}
        <label>
          Valor:
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>

        <button type="submit">Enviar</button>
      </form>

      {/* Resultado */}
      {resultado && (
        <div className="resultado">
          <strong>Resultado:</strong> {resultado}
        </div>
      )}
    </div>
  );
}
