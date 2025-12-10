import React, { useMemo } from "react";

const factorHeaders = Array.from({ length: 30 }, (_, i) => i + 8);

export default function TablaCalificaciones({
	rows = [],
	selectedId,
	onSelect,
	onEdit,
	onDelete,
	selectedFactor = "all",
}) {
	const factorLabel = selectedFactor === "all" ? "Σ F8-F37" : `F${selectedFactor}`;

	const columns = useMemo(
		() => [
			"Ejercicio",
			"Instrumento",
			"Fecha Pago",
			"Descripción",
			"Secuencia",
			"ISFUT",
			"Mercado",
			"Origen",
			"Fuente",
			factorLabel,
			"Actualizado",
			"Acciones",
		],
		[factorLabel]
	);

	return (
		<div className="table-card">
			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							<th></th>
							{columns.map(col => (
								<th key={col}>{col}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.length === 0 && (
							<tr>
								<td colSpan={columns.length + 1} style={{ textAlign: "center", padding: 18, color: "#7c8a93" }}>
									Sin calificaciones cargadas.
								</td>
							</tr>
						)}
						{rows.map(row => {
							const factorMap = {};
							(row.factors || []).forEach(f => {
								factorMap[f.id] = f.calculado ?? f.valor ?? f.original ?? 0;
							});
							const sumaFactores = factorHeaders.reduce((acc, n) => acc + Number(factorMap[n] || 0), 0).toFixed(6);
							const factorKey = selectedFactor === "all" ? null : Number(selectedFactor);
							const displayedFactor =
								selectedFactor === "all"
									? `Σ ${sumaFactores}`
									: factorKey != null && factorMap[factorKey] != null
										? Number(factorMap[factorKey]).toFixed(6)
										: "-";
							return (
								<tr key={row.id}>
									<td>
										<input
											type="radio"
											name="selectedRow"
											checked={selectedId === row.id}
											onChange={() => onSelect?.(row)}
										/>
									</td>
									<td>{row.anioComercial || "-"}</td>
									<td>{row.instrumento}</td>
									<td>{row.fechaPago}</td>
									<td>{row.descripcion || ""}</td>
									<td>{row.secuenciaEvento}</td>
									<td>{row.acogidoIsfut ? "Sí" : "No"}</td>
									<td>
										<span className={`row-tag ${row.mercado === "Nacional" ? "tag-green" : "tag-orange"}`}>
											{row.mercado || ""}
										</span>
									</td>
									<td>{row.origen || ""}</td>
									<td>{row.fuente || ""}</td>
									<td>{displayedFactor}</td>
									<td>
										<div style={{ color: "#7c8a93", fontSize: 12 }}>
											{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"}
										</div>
									</td>
									<td>
										<div className="actions">
											<button className="icon-btn" onClick={() => onEdit?.(row)} title="Editar">
												✏️
											</button>
											<button className="icon-btn" onClick={() => onDelete?.(row)} title="Eliminar">
												🗑
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
