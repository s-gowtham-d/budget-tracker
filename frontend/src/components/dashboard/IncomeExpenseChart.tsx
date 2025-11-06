
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from '@/lib/currency';
import { BarChart3 } from 'lucide-react';

export default function IncomeExpenseChart({ data }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { symbol } = useCurrency();

    const isEmpty = data.reduce((acc, curr) => acc + curr.income + curr.expense, 0) === 0;


    useEffect(() => {
        if (isEmpty) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Get container dimensions
        const container = containerRef.current;
        //@ts-nocheck
        const containerWidth = container?.clientWidth;
        const containerHeight = 400;

        // Set up dimensions and margins
        const margin = { top: 60, right: 60, bottom: 20, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set up scales
        const x0 = d3.scaleBand()
            .domain(data.map(d => d.month))
            .rangeRound([0, width])
            .paddingInner(0.1);

        const x1 = d3.scaleBand()
            .domain(['income', 'expense'])
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.income, d.expense)) * 1.1])
            .nice()
            .rangeRound([height, 0]);

        // Colors
        const colors = {
            income: '#10b981', // emerald-500
            expense: '#ef4444'  // red-500
        };

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll('text')
            .style('font-size', '12px');

        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${symbol}${d / 100}k`))
            .selectAll('text')
            .style('font-size', '12px');

        // Add grid lines
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-width)
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

        // Add bars for each month
        const monthGroups = svg.selectAll('.month-group')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${x0(d.month)},0)`);

        // Income bars
        // @ts-nocheck
        monthGroups.append('rect')
            .attr('x', x1('income'))
            .attr('y', height)
            .attr('width', x1.bandwidth())
            .attr('height', 0)
            .attr('fill', colors.income)
            .attr('rx', 4)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', 0.8);
                tooltip
                    .style('visibility', 'visible')
                    .html(`
            <strong>${d.month}</strong><br/>
            Income: $${d.income.toLocaleString()}
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
            .duration(800)
            .attr('y', d => y(d.income))
            .attr('height', d => height - y(d.income));

        // Expense bars
        monthGroups.append('rect')
            .attr('x', x1('expense'))
            .attr('y', height)
            .attr('width', x1.bandwidth())
            .attr('height', 0)
            .attr('fill', colors.expense)
            .attr('rx', 4)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', 0.8);
                tooltip
                    .style('visibility', 'visible')
                    .html(`
            <strong>${d.month}</strong><br/>
            Expense: $${d.expense.toLocaleString()}
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
            .duration(800)
            .attr('y', d => y(d.expense))
            .attr('height', d => height - y(d.expense));

        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 80}, 0)`);

        const legendData = [
            { label: 'Income', color: colors.income },
            { label: 'Expense', color: colors.expense }
        ];

        legendData.forEach((item, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 25})`);

            legendRow.append('rect')
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', item.color)
                .attr('rx', 2);

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .style('font-size', '12px')
                .text(item.label);
        });

        // Cleanup function
        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Last 6 months comparison</CardDescription>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mb-3 opacity-60" />
                        <p className="font-medium text-sm">No data available</p>
                        <p className="text-xs">Start by adding income and expense transactions to visualize your trends.</p>
                    </div>
                ) : (
                    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
                        <svg ref={svgRef} style={{ width: '100%', height: '400px' }}></svg>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}