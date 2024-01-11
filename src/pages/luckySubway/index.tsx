import { Button, Card, Divider, Result, Selector, Switch, Toast } from 'antd-mobile';
import { HeartFill, LeftOutline } from 'antd-mobile-icons';
import { SubWayData } from '@/store/subwayData';
import styles from './index.less';
import { useEffect, useRef, useState } from 'react';
import { StepSchemaRes, SwStateStep } from './index.interface';

export default function LuckySubway() {
  const subwayLines = [...SubWayData.keys()];
  const [step, setStep] = useState(SwStateStep.step1);
  const animationTimeout = useRef<NodeJS.Timeout>();
  const [stepLoading, setStepLoading] = useState(false);
  const [lineDisabled, setLineDisabled] = useState(true); // 是否随机线路

  // 地铁线路
  const [lineIndex, setLineIndex] = useState<number>();
  const [subwayLineName, setSubwayLineName] = useState('');
  const subwayLinesOptions = subwayLines.map((m, i) => ({ label: m, value: i, disabled: false }));
  // 地铁站点
  const [siteIndex, setSiteIndex] = useState<number>(0);
  const subwaySites = SubWayData.get(subwayLineName)!;
  const [subwaySiteName, setSubwaySiteName] = useState('');
  const subwaySiteOptions = subwaySites?.map((m, i) => ({ label: m, value: i, disabled: false })) ?? [];

  const getLuckyLine = () => {
    if (stepLoading) return;
    setStepLoading(true);
    let index = 0;
    let indexRef = 0;
    const length = 14;
    const maxTimes = length * 2;
    animationTimeout.current = setInterval(() => {
      index++;
      if (index === maxTimes) {
        clearInterval(animationTimeout.current);
        setTimeout(() => {
          const slName = subwayLines[indexRef];
          setSubwayLineName(slName);
          setStep(SwStateStep.step2);
          setStepLoading(false);
        }, 350);
        return;
      }
      indexRef = Math.floor(Math.random() * length);
      setLineIndex(indexRef);
    }, 50 + index);
  };

  const getLuckySite = () => {
    if (stepLoading) return;
    setStepLoading(true);
    let index = 0;
    let indexRef = 0;
    const length = subwaySites?.length;
    const maxTimes = 78;
    animationTimeout.current = setInterval(() => {
      index++;
      if (index === maxTimes) {
        clearInterval(animationTimeout.current);
        setTimeout(() => {
          const slName = subwaySites?.[indexRef];
          setSubwaySiteName(slName);
          setStep(SwStateStep.Step3);
          setStepLoading(false);
        }, 350);
        return;
      }
      indexRef = Math.floor(Math.random() * length);
      setSiteIndex(indexRef);
    }, 50 + index);
  };

  const copySite = async () => {
    try {
      await navigator.clipboard.writeText(subwaySiteName);
      Toast.show({ content: '复制成功', duration: 1500 });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const stepPush = (step: SwStateStep) => {
    !stepLoading && setStep(step);
  };

  const StepSchema = (): StepSchemaRes => {
    switch (step) {
      case SwStateStep.step1:
        return {
          nextStep: getLuckyLine,
          navTitle: (
            <div>
              幸运地铁
              <Switch
                checked={lineDisabled}
                onChange={(bl) => setLineDisabled(bl)}
                defaultChecked
                uncheckedText="自选"
                checkedText="随机"
                style={{ '--height': '25px', '--width': '42px', marginLeft: '8px' }}
              />
            </div>
          ),
          nextTitle: '获取幸运线路',
        };
      case SwStateStep.step2:
        return {
          nextStep: getLuckySite,
          navTitle: (
            <a color="primary" onClick={() => stepPush(SwStateStep.step1)}>
              <LeftOutline /> {subwayLineName}
            </a>
          ),
          nextTitle: '获取幸运站点',
        };
      case SwStateStep.Step3:
        return {
          nextStep: copySite,
          navTitle: (
            <a color="primary" onClick={() => stepPush(SwStateStep.step2)}>
              <LeftOutline /> {subwaySiteName}
            </a>
          ),
          nextTitle: '复制站点名',
        };
    }
  };

  const { nextStep, navTitle, nextTitle } = StepSchema();

  useEffect(() => {
    return () => clearInterval(animationTimeout.current);
  }, []);

  return (
    <>
      <Card headerStyle={{ border: 'none' }} title={<div className={styles['nav-title']}>{navTitle}</div>}>
        <Divider />
        <div className={styles['lucy-box']}>
          {step === SwStateStep.step1 && (
            <Selector
              value={[lineIndex as number]}
              style={{
                '--border-radius': '100px',
                '--border': 'solid transparent 1px',
                '--checked-color': '#F5F5F5',
                '--checked-border': 'solid var(--adm-color-primary) 1px',
                '--padding': '8px 24px',
              }}
              onChange={
                lineDisabled
                  ? undefined
                  : (v) => {
                      const index = v[0] ?? lineIndex;
                      setLineIndex(index);
                      const slName = subwayLines[index];
                      setSubwayLineName(slName);
                      setStep(SwStateStep.step2);
                    }
              }
              options={subwayLinesOptions}
              showCheckMark={false}
            />
          )}
          {step === SwStateStep.step2 && (
            <Selector
              value={[siteIndex]}
              style={{
                '--border-radius': '100px',
                '--checked-color': ' var(--adm-color-primary)',
                '--checked-text-color': '#fff',
                '--padding': '8px 24px',
              }}
              options={subwaySiteOptions}
              showCheckMark={false}
            />
          )}
          {step === SwStateStep.Step3 && (
            <Result
              icon={<HeartFill />}
              status="success"
              title={<b>{subwaySiteName}</b>}
              description="出发吧！向着明天，向着成功，向着新生活，发出万丈光芒！"
            />
          )}
        </div>
      </Card>
      {(step !== SwStateStep.step1 || lineDisabled) && (
        <div className={styles['floating-button']}>
          <Button
            block
            fill="outline"
            loading={stepLoading}
            color="primary"
            shape="rounded"
            onClick={nextStep}
            style={{ '--background-color': 'rgba(255, 255, 255, 0.8)' }}
          >
            {nextTitle}
          </Button>
        </div>
      )}
    </>
  );
}
