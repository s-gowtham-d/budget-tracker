import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from '@/lib/currency';

export default function BudgetComparisonChart({ data }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
      const { symbol } = useCurrency();


    useEffect(() => {
        if (!data || data.length === 0) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = 500;

        const margin = { top: 20, right: 120, bottom: 40, left: 150 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const y = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, height])
            .padding(0.3);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.budget, d.spent)) * 1.1])
            .range([0, width]);

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${symbol}${d / 1000}k`))
            .selectAll('text')
            .style('font-size', '12px');

        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '12px');

        // Grid lines
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisBottom(x)
                .ticks(5)
                .tickSize(height)
                .tickFormat('')
            );

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

        // Budget bars (background)
        svg.selectAll('.budget-bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'budget-bar')
            .attr('x', 1)
            .attr('y', d => y(d.category)! + y.bandwidth() / 4)
            .attr('width', 0)
            .attr('height', y.bandwidth() / 2)
            .attr('fill', '#e2e8f0')
            .attr('rx', 4)
            .transition()
            .duration(800)
            .attr('width', d => x(d.budget));

        // Spent bars (foreground)
        svg.selectAll('.spent-bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'spent-bar')
            .attr('x', 1)
            .attr('y', d => y(d.category)! + y.bandwidth() / 4)
            .attr('width', 0)
            .attr('height', y.bandwidth() / 2)
            .attr('fill', d => d.spent > d.budget ? '#ef4444' : '#10b981')
            .attr('rx', 4)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', 0.8);
                const percentage = ((d.spent / d.budget) * 100).toFixed(1);
                tooltip
                    .style('visibility', 'visible')
                    .html(`
            <strong>${d.category}</strong><br/>
            Budget: ${symbol}${d.budget.toLocaleString()}<br/>
            Spent: ${symbol}${d.spent.toLocaleString()}<br/>
            ${percentage}% used
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
                d3.select(this).attr('opacity', 1);
                tooltip.style('visibility', 'hidden');
            })
            .transition()
            .duration(1000)
            .delay((d, i) => i * 100)
            .attr('width', d => x(d.spent));

        // Labels
        svg.selectAll('.budget-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'budget-label')
            .attr('x', d => x(d.budget) + 5)
            .attr('y', d => y(d.category)! + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .style('font-size', '11px')
            .style('fill', '#64748b')
            .style('opacity', 0)
            .text(d => `${symbol}${d.budget.toLocaleString()}`)
            .transition()
            .delay(1000)
            .duration(400)
            .style('opacity', 1);

        svg.selectAll('.spent-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'spent-label')
            .attr('x', d => x(d.spent) + 5)
            .attr('y', d => y(d.category)! + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', d => d.spent > d.budget ? '#ef4444' : '#10b981')
            .style('opacity', 0)
            .text(d => `${symbol}${d.spent.toLocaleString()}`)
            .transition()
            .delay(1000)
            .duration(400)
            .style('opacity', 1);

        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 100}, -10)`);

        const legendData = [
            { label: 'Budget', color: '#e2e8f0' },
            { label: 'Spent', color: '#10b981' },
            { label: 'Over Budget', color: '#ef4444' }
        ];

        legendData.forEach((item, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`);

            legendRow.append('rect')
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', item.color)
                .attr('rx', 2);

            legendRow.append('text')
                .attr('x', 18)
                .attr('y', 10)
                .style('font-size', '11px')
                .text(item.label);
        });

        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
                <CardDescription>Compare your budget with actual expenses (D3.js)</CardDescription>
            </CardHeader>
            <CardContent>
                <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
                    <svg ref={svgRef} style={{ width: '100%', height: '500px' }}></svg>
                </div>
            </CardContent>
        </Card>
    );
}