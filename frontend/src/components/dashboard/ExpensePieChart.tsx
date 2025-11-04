
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from '@/lib/currency';
import { FileBarChart } from 'lucide-react';

export default function ExpensePieChart({ data }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { symbol } = useCurrency();
    const isEmpty = !data || data.length === 0;


    useEffect(() => {
        if (!data || data.length === 0) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Get container dimensions
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = 400;

        const width = containerWidth;
        const height = containerHeight;
        const radius = Math.min(width, height) / 2 - 40;

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.category))
            .range([
                '#10b981', // emerald
                '#3b82f6', // blue
                '#8b5cf6', // purple
                '#f59e0b', // amber
                '#ec4899', // pink
                '#6b7280'  // gray
            ]);

        // Calculate total
        const total = d3.sum(data, d => d.amount);

        // Create pie layout
        const pie = d3.pie()
            .value(d => d.amount)
            .sort(null);

        // Create arc
        const arc = d3.arc()
            .innerRadius(radius * 0.6)  // Donut chart
            .outerRadius(radius);

        const arcHover = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius + 10);

        // Create tooltip
        const tooltip = d3.select(container)
            .append('div')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px 12px')
            .style('border-radius', '6px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '10');

        // Create arcs
        const arcs = svg.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // Add paths
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.category))
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('d', arcHover);

                const percentage = ((d.data.amount / total) * 100).toFixed(1);
                tooltip
                    .style('visibility', 'visible')
                    .html(`
            <strong>${d.data.category}</strong><br/>
            Amount: ${symbol}${d.data.amount.toLocaleString()}<br/>
            ${percentage}% of total
          `);
            })
            .on('mousemove', function (event) {
                const containerRect = container.getBoundingClientRect();
                const tooltipX = event.clientX - containerRect.left + 10;
                const tooltipY = event.clientY - containerRect.top + 10;
                tooltip
                    .style('left', `${tooltipX}px`)
                    .style('top', `${tooltipY}px`);
            })

            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('d', arc);
                tooltip.style('visibility', 'hidden');
            })
            .transition()
            .duration(800)
            .style('opacity', 1)
            .attrTween('d', function (d) {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });

        // Add percentage labels
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .style('opacity', 0)
            .text(d => {
                const percentage = ((d.data.amount / total) * 100).toFixed(0);
                return percentage > 5 ? `${percentage}%` : '';
            })
            .transition()
            .delay(800)
            .duration(400)
            .style('opacity', 1);

        // Add center text (total)
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.5em')
            .style('font-size', '14px')
            .style('fill', 'currentColor')
            .style('opacity', 0)
            .text('Total Expenses')
            .transition()
            .delay(1000)
            .duration(400)
            .style('opacity', 0.6);

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .style('font-size', '24px')
            .style('font-weight', 'bold')
            .style('fill', 'currentColor')
            .style('opacity', 0)
            .text(`${symbol}${total.toLocaleString()}`)
            .transition()
            .delay(1000)
            .duration(400)
            .style('opacity', 1);

        // Cleanup function
        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>By category this month</CardDescription>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground">
                        <FileBarChart className="h-12 w-12 mb-3 opacity-60" />
                        <p className="font-medium text-sm">No expenses yet</p>
                        <p className="text-xs">Create a budget or add some transactions to see your expense breakdown.</p>
                    </div>
                ) : (
                    <>
                        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
                            <svg ref={svgRef} style={{ width: '100%', height: '400px' }}></svg>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {data.map((item, index) => {
                                const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6b7280'];
                                return (
                                    <div key={item.category} className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: colors[index % colors.length] }}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {item.category} ({symbol}{item.amount.toLocaleString()})
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>);
}
