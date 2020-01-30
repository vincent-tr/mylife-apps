'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refKeywordView, unrefKeywordView } from './actions';
import { getKeywordView, getKeywords } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      keywordView: getKeywordView(state),
      keywords: getKeywords(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refKeywordView()),
      leave: () => dispatch(unrefKeywordView())
    }), [dispatch])
  };
};

export function useKeywordView() {
  const { enter, leave, keywords, keywordView } = useConnect();
  useLifecycle(enter, leave);
  return { keywords, keywordView };
}
