import React, {useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactDropdown from 'react-dropdown';
import { csv, scaleLinear, extent, min, max, format, scaleOrdinal } from 'd3';
import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';
import { ColorLegend } from './ColorLegend';
import './style.css';

const width = 960;
const menuHeight = 50;
const height = 600 - menuHeight;
const margin = { top: 20, right: 200, bottom: 70, left: 60 };
const xAxisLabelOffset = 40;
const AxisOffset = 5;
const circleRadius = 7;
const fadeOpacity = 0.2;


const attributes = [
    { value: 'sepal_length', label: 'Sepal Length' },
    { value: 'sepal_width', label: 'Sepal Width' },
    { value: 'petal_length', label: 'Petal Length' },
    { value: 'petal_width', label: 'Petal Width' },
];

const getValue = value => {
    for( let i = 0; i < attributes.length; i++) {
        if(attributes[i].value === value) {
            return attributes[i].label;
        }
    }
};

const App = () => {
    const data = useData();
    const [hoveredValue, setHoveredValue] = useState(null);

    const initialXAttribute = 'petal_length'
    const [xAttribute, setXAttribute] = useState(initialXAttribute);
    const xValue = d => d[xAttribute];
    const xAxisLabel = getValue(xAttribute);

    const initialYAttribute = 'petal_width'
    const [yAttribute, setYAttribute] = useState(initialYAttribute);
    const yValue = d => d[yAttribute];
    const yAxisLabel = getValue(yAttribute);

    const colorValue = d => d.species;

    if (!data) {
        return <div>Loading...</div>;
    }

    const filterdData = data.filter(d => hoveredValue === colorValue(d));

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const siFormat = format('.2s');
    const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

    const xScale = scaleLinear()
        .domain(extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = scaleLinear()
        .domain(extent(data, yValue))
        .range([innerHeight - 10, 0 ])
        .nice();
    
    const colorScale = scaleOrdinal()
        .domain(data.map(colorValue))
        .range(['#2e4e57', '#336636', '#792112']);

    return(
        <container className="plot">
            <div className="menus-container">
                <span className="dropdown-label">x-Axis:</span>
                <ReactDropdown
                    options={attributes}
                    value={xAttribute}
                    onChange={({ value }) => setXAttribute(value)}
                />
                <span className="dropdown-label">y-Axis:</span>
                <ReactDropdown
                    options={attributes}
                    value={yAttribute}
                    onChange={({ value }) => setYAttribute(value)}
                />
            </div>
            <h1 className="header">Iris Dataset</h1>
            <svg className="plot" width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <AxisBottom 
                        xScale={xScale} 
                        innerHeight={innerHeight} 
                        tickFormat={xAxisTickFormat}
                        tickOffset={AxisOffset}
                        />
                    <text
                        className="axis-label"
                        textAnchor="middle"
                        transform={'rotate(-90)'}
                        dy= {-xAxisLabelOffset}
                        dx={-innerHeight / 2}
                    >
                        {yAxisLabel}
                    </text>                
                    <AxisLeft 
                        yScale={yScale} 
                        innerWidth={innerWidth} 
                        tickOffset={AxisOffset}
                    />
                    <text
                        className="axis-label"
                        x={innerWidth / 2}
                        y={innerHeight + xAxisLabelOffset}
                        textAnchor="middle"
                    >
                        {xAxisLabel}
                    </text>
                    <g opacity={hoveredValue ? fadeOpacity : 1}>
                        <Marks 
                            data={data} 
                            xScale={xScale} 
                            yScale={yScale}
                            xValue={xValue}
                            yValue={yValue}
                            colorScale={colorScale}
                            colorValue={colorValue}
                            tooltipFormat={xAxisTickFormat}
                            circleRadius={circleRadius}
                        />
                    </g>
                    <Marks 
                        data={filterdData} 
                        xScale={xScale} 
                        yScale={yScale}
                        xValue={xValue}
                        yValue={yValue}
                        colorScale={colorScale}
                        colorValue={colorValue}
                        tooltipFormat={xAxisTickFormat}
                        circleRadius={circleRadius}
                    />
                    <g className="legend" transform={`translate(${innerWidth+50},40)`}>
                        <text 
                            className="legend-title"
                            x={35}
                            y={-25}
                            className="axis-label"
                            textAnchor="middle"
                        >
                            Species
                        </text>
                        <ColorLegend
                            tickSpacing={22}
                            tickTextOffset={12} 
                            colorScale={colorScale}
                            colorValue={colorValue}
                            circleRadius={circleRadius}
                            onHover={ setHoveredValue }
                        />
                    </g>
                </g>
            </svg>
        </container>
        );
    };
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);