export const Marks = ({ 
    data,
    xScale,
    yScale,
    xValue,
    yValue,
    colorScale,
    colorValue,
    tooltipFormat,
    circleRadius
}) => 
    data.map(d => (
        <circle
            className='mark'
            cx = {xScale(xValue(d))}
            cy = {yScale(yValue(d))}
            r = {circleRadius}
            fill = {colorScale(colorValue(d))}
            key = {d.id}
        >
            <title>{ colorValue(d) }</title>
        </circle>        
    ));

