import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { area, stack, stackOrderReverse } from 'd3-shape';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

function CumulativeFlowDiagram({
  startDate,
  endDate,
  width,
  height,
  stackData,
  margin,
  keys,
  total,
  backgroundTitle,
}) {
  const timeScale = scaleTime()
    .domain([startDate, endDate])
    .range([margin.left, width - margin.right]);
  const xAxis = axisBottom().scale(timeScale);

  const scopeScale = scaleLinear()
    .domain([0, total])
    .range([height - margin.bottom, margin.top]);
  const yAxis = axisLeft().scale(scopeScale);

  const xAxisRef = useRef();
  const yAxisRef = useRef();

  useEffect(() => {
    if (xAxisRef.current) {
      select(xAxisRef.current)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
    }
    if (yAxisRef.current) {
      select(yAxisRef.current)
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);
    }
  });

  const series = stack().keys(keys).order(stackOrderReverse)(stackData);

  const areaFn = area()
    .x((d) => timeScale(d.data.date))
    .y0((d) => scopeScale(d[0]))
    .y1((d) => scopeScale(d[1]));

  const colorFn = scaleOrdinal().domain(keys).range(schemeCategory10);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={margin.left}
        y={margin.top}
        width={width - (margin.left + margin.right)}
        height={height - (margin.top + margin.bottom)}
        fill="lightgray"
      >
        {backgroundTitle && <title>{backgroundTitle}</title>}
      </rect>
      <g ref={xAxisRef} />
      <g ref={yAxisRef} />
      {series.map((innerArr, i) => {
        return (
          <path key={i} d={areaFn(innerArr)} fill={colorFn(innerArr.key)}>
            <title>{innerArr.key}</title>
          </path>
        );
      })}
    </svg>
  );
}

CumulativeFlowDiagram.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  total: PropTypes.number.isRequired,
  stackData: function (props, propName, componentName) {
    if (
      !Array.isArray(props[propName]) ||
      !props[propName].every(
        (el) =>
          el.date &&
          !isNaN(new Date(el.date)) &&
          props['keys'].every((key) => !el[key] || typeof el[key] === 'number')
      )
    ) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. Validation failed. ` +
          `Each element in the array must have a date property, and all element properties matching keys must be numbers.`
      );
    }
  },
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  backgroundTitle: PropTypes.string,
};

CumulativeFlowDiagram.defaultProps = {
  margin: {
    top: 10,
    right: 10,
    bottom: 30,
    left: 30,
  },
};

export default CumulativeFlowDiagram;
