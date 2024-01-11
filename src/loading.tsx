import style from './loading.less';

export default function Loading() {
  return (
    <div className={style['base-loading-wrap']}>
      <div className={style['cat__loading']}>
        <div className={style['cat__loading__body']}></div>
        <div className={style['cat__loading__body']}></div>
        <div className={style['cat__loading__tail']}></div>
        <div className={style['cat__loading__head']}></div>
      </div>
    </div>
  );
}
