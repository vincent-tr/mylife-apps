import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { noop, useLifecycle, useScreenSize, views } from 'mylife-tools';
import { useAppSelector, useAppDispatch } from '../../store-api';
import { isOperationDetail, getCriteria, setOperationViewId, clearOperationViewId, getOperationViewId, closeDetail } from '../store';
import Detail from './detail';
import List from './list';
import Tree from './tree';

const Container = styled('div')({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'row',
});

const StyledList = styled(List)({
  flex: '1 1 auto',
});

const StyledDetail = styled(Detail)({
  flex: 5,
});

const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    detail: useAppSelector(isOperationDetail),
    ...useMemo(
      () => ({
        closeDetail: () => dispatch(closeDetail()),
      }),
      [dispatch]
    ),
  };
};

export default function Management() {
  const screenSize = useScreenSize();
  const { detail, closeDetail } = useConnect();
  useLifecycle(noop, closeDetail);

  const criteria = useAppSelector(getCriteria);
  views.useCriteriaView({
    service: 'management',
    method: 'notifyOperations',
    criteria,
    setViewIdAction: setOperationViewId,
    clearViewIdAction: clearOperationViewId,
    viewIdSelector: getOperationViewId,
  });

  const main = detail ? <StyledDetail /> : <StyledList />;

  const normalLayout = (
    <Container>
      <Tree />
      {main}
    </Container>
  );

  const smallLayout = <Container>{main}</Container>;

  switch (screenSize) {
    case 'phone':
      return smallLayout;

    case 'tablet':
    case 'laptop':
    case 'wide':
      return normalLayout;
  }
}
