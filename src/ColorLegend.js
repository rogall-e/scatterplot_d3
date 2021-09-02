export const ColorLegend = ({ 
    colorScale, 
    circleRadius, 
    tickSpacing = 20,
    tickTextOffset = 10,
    onHover,
    hoveredValue,
    fadedOpacity
}) => 
    colorScale.domain().map((domainValue, i) => (
        <g 
            className="legend" 
            transform={`translate(0, ${i * tickSpacing})`}
            onMouseEnter={() => 
                { onHover(domainValue);
            }}
            onMouseOut={() =>
                { onHover(null);
            }}
            opacity={hoveredValue && domainValue !== hoveredValue ? fadedOpacity : 1}
        >
            <circle fill={colorScale(domainValue)} r={circleRadius} />
            <text x={tickTextOffset} dy=".32em" >{domainValue}</text>
        </g>
    ));
