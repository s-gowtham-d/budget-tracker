import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function BudgetOverviewChart({ data }) {
    const svgRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        if (!data || data.length === 0) return
        const container = containerRef.current
        const width = container.clientWidth
        const height = 350
        const margin = { top: 20, right: 30, bottom: 30, left: 100 }

        d3.select(svgRef.current).selectAll("*").remove()

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.category))
            .range([0, height - margin.top - margin.bottom])
            .padding(0.2)

        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => Math.max(d.limit, d.spent)) * 1.1])
            .nice()
            .range([0, width - margin.left - margin.right])

        svg
            .selectAll(".bar-bg")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d) => y(d.category))
            .attr("height", y.bandwidth())
            .attr("width", (d) => x(d.limit))
            .attr("fill", "#e5e7eb")
            .attr("rx", 4)

        svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d) => y(d.category))
            .attr("height", y.bandwidth())
            .attr("width", 0)
            .attr("fill", "#10b981")
            .attr("rx", 4)
            .transition()
            .duration(800)
            .attr("width", (d) => x(d.spent))

        svg
            .append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px")

        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
            .call(d3.axisBottom(x).ticks(5))
            .selectAll("text")
            .style("font-size", "12px")
    }, [data])

    return (
        <div ref={containerRef} className="w-full relative">
            <svg ref={svgRef}></svg>
        </div>
    )
}
