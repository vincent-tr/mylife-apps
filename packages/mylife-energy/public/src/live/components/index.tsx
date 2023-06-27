import { React, mui, useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getSensorView, getMeasureView } from '../selectors';

type FIXME_any = any;

const Live = () => {
  const { enter, leave, sensors, measures } = useConnect();
  useLifecycle(enter, leave);

  return (
    <mui.TableContainer>
      <mui.Table size='small' stickyHeader>
        <mui.TableHead>
          <mui.TableRow>
            <mui.TableCell>{'Id'}</mui.TableCell>
            <mui.TableCell>{'Timestamp'}</mui.TableCell>
            <mui.TableCell>{'Value'}</mui.TableCell>
            <mui.TableCell>{'Unit'}</mui.TableCell>
          </mui.TableRow>
        </mui.TableHead>
        <mui.TableBody>
          {measures.valueSeq().filter(item => item._id.endsWith('-current')).sortBy(item => item._id).map(item => (
            <mui.TableRow key={item._id}>
              <mui.TableCell>{item._id}</mui.TableCell>
              <mui.TableCell>{item.timestamp.toLocaleString()}</mui.TableCell>
              <mui.TableCell>{item.value}</mui.TableCell>
              <mui.TableCell>{'TODO'}</mui.TableCell>
            </mui.TableRow>
          ))}
        </mui.TableBody>
      </mui.Table>
    </mui.TableContainer>
  );
};

export default Live;

function useConnect() {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      sensors: getSensorView(state),
      measures: getMeasureView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
}
