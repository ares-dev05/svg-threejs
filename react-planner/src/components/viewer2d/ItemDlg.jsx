import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';

export default function ItemDlg({item, layer, width, DEPTH, margin, half_thickness, scale, setScale}) {
  let {x, y, rotation, zoom} = item;
  useEffect(() => {
    console.log('--')
  }, []);

  return (
    <svg viewBox="0 0 240 80">
        <text>Width</text>
    </svg>
  )
}

ItemDlg.propTypes = {
};

