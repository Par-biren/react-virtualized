import clsx from 'clsx';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import styles from './List.example.css';
import AutoSizer from '../AutoSizer';
import List from './List';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';

const ListContext = React.createContext();

const ListExample = () => {
  const context = useContext(ListContext);
  const [listHeight, setListHeight] = useState(300);
  const [listRowHeight, setListRowHeight] = useState(50);
  const [overscanRowCount, setOverscanRowCount] = useState(10);
  const [rowCount, setRowCount] = useState(context.list.size);
  const [scrollToIndex, setScrollToIndex] = useState(undefined);
  const [showScrollingPlaceholder, setShowScrollingPlaceholder] = useState(false);
  const [useDynamicRowHeight, setUseDynamicRowHeight] = useState(false);

  const getDatum = (index) => context.list.get(index % context.list.size);

  const getRowHeight = ({ index }) => getDatum(index).size;

  const noRowsRenderer = () => <div className={styles.noRows}>No rows</div>;

  const rowRenderer = ({ index, isScrolling, key, style }) => {
    if (showScrollingPlaceholder && isScrolling) {
      return (
        <div
          className={clsx(styles.row, styles.isScrollingPlaceholder)}
          key={key}
          style={style}
        >
          Scrolling...
        </div>
      );
    }

    const datum = getDatum(index);
    let additionalContent;

    if (useDynamicRowHeight) {
      if (datum.size === 75) {
        additionalContent = <div>It is medium-sized.</div>;
      } else if (datum.size === 100) {
        additionalContent = (
          <div>
            It is large-sized.
            <br />
            It has a 3rd row.
          </div>
        );
      }
    }

    return (
      <div className={styles.row} key={key} style={style}>
        <div className={styles.letter} style={{ backgroundColor: datum.color }}>
          {datum.name.charAt(0)}
        </div>
        <div>
          <div className={styles.name}>{datum.name}</div>
          <div className={styles.index}>This is row {index}</div>
          {additionalContent}
        </div>
        {useDynamicRowHeight && <span className={styles.height}>{datum.size}px</span>}
      </div>
    );
  };

  return (
    <ContentBox>
      <ContentBoxHeader
        text="List"
        sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/List/List.example.js"
        docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md"
      />

      <ContentBoxParagraph>
        The list below is windowed (or "virtualized") meaning that only the visible rows are rendered.
        Adjust its configurable properties below to see how it reacts.
      </ContentBoxParagraph>

      <ContentBoxParagraph>
        <label className={styles.checkboxLabel}>
          <input
            aria-label="Use dynamic row heights?"
            checked={useDynamicRowHeight}
            className={styles.checkbox}
            type="checkbox"
            onChange={(e) => setUseDynamicRowHeight(e.target.checked)}
          />
          Use dynamic row heights?
        </label>

        <label className={styles.checkboxLabel}>
          <input
            aria-label="Show scrolling placeholder?"
            checked={showScrollingPlaceholder}
            className={styles.checkbox}
            type="checkbox"
            onChange={(e) => setShowScrollingPlaceholder(e.target.checked)}
          />
          Show scrolling placeholder?
        </label>
      </ContentBoxParagraph>

      <InputRow>
        <LabeledInput label="Num rows" name="rowCount" onChange={(e) => setRowCount(parseInt(e.target.value, 10) || 0)} value={rowCount} />
        <LabeledInput label="Scroll to" name="onScrollToRow" placeholder="Index..." onChange={(e) => setScrollToIndex(parseInt(e.target.value, 10) || undefined)} value={scrollToIndex || ''} />
        <LabeledInput label="List height" name="listHeight" onChange={(e) => setListHeight(parseInt(e.target.value, 10) || 1)} value={listHeight} />
        <LabeledInput disabled={useDynamicRowHeight} label="Row height" name="listRowHeight" onChange={(e) => setListRowHeight(parseInt(e.target.value, 10) || 1)} value={listRowHeight} />
        <LabeledInput label="Overscan" name="overscanRowCount" onChange={(e) => setOverscanRowCount(parseInt(e.target.value, 10) || 0)} value={overscanRowCount} />
      </InputRow>

      <div>
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              className={styles.List}
              height={listHeight}
              overscanRowCount={overscanRowCount}
              noRowsRenderer={noRowsRenderer}
              rowCount={rowCount}
              rowHeight={useDynamicRowHeight ? getRowHeight : listRowHeight}
              rowRenderer={rowRenderer}
              scrollToIndex={scrollToIndex}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    </ContentBox>
  );
};

ListExample.contextTypes = {
  list: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default ListExample;
