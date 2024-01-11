import { Button, Card, Result, Selector, Toast } from 'antd-mobile';
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

  // 地铁线路
  const [lineIndex, setLineIndex] = useState<number>(0);
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
    const maxTimes = length * 3;
    animationTimeout.current = setInterval(() => {
      index++;
      if (index === maxTimes) {
        clearInterval(animationTimeout.current);
        setStepLoading(false);
        setTimeout(() => {
          const slName = subwayLines[indexRef];
          setSubwayLineName(slName);
          setStep(SwStateStep.step2);
        }, 500);
        // Dialog.confirm({
        //   title: <SmileOutline color="var(--adm-color-primary)" />,
        //   confirmText: '选择站台',
        //   content: <div>{slName}</div>,
        //   onConfirm: () => {
        //     setSubwayLineName(slName);
        //     setStep(SwStateStep.step2);
        //   },
        // });
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
    const maxTimes = length * 3;
    animationTimeout.current = setInterval(() => {
      index++;
      if (index === maxTimes) {
        clearInterval(animationTimeout.current);
        setStepLoading(false);
        setTimeout(() => {
          const slName = subwaySites?.[indexRef];
          setSubwaySiteName(slName);
          setStep(SwStateStep.Step3);
        }, 500);
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

  const StepSchema = (): StepSchemaRes => {
    switch (step) {
      case SwStateStep.step1:
        return {
          nextStep: getLuckyLine,
          navTitle: '幸运地铁',
          nextTitle: '获取幸运线路',
        };
      case SwStateStep.step2:
        return {
          nextStep: getLuckySite,
          navTitle: (
            <a color="primary" onClick={() => setStep(SwStateStep.step1)}>
              <LeftOutline /> {subwayLineName}
            </a>
          ),
          nextTitle: '获取幸运站点',
        };
      case SwStateStep.Step3:
        return {
          nextStep: copySite,
          navTitle: (
            <a color="primary" onClick={() => setStep(SwStateStep.step2)}>
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
      <Card title={navTitle}>
        <div className={styles['lucy-box']}>
          {step === SwStateStep.step1 && (
            <Selector
              value={[lineIndex]}
              style={{
                '--border-radius': '100px',
                '--border': 'solid transparent 1px',
                '--checked-color': '#F5F5F5',
                '--checked-border': 'solid var(--adm-color-primary) 1px',
                '--padding': '8px 24px',
              }}
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
        <Button block fill="outline" loading={stepLoading} color="primary" shape="rounded" onClick={nextStep}>
          {nextTitle}
        </Button>
      </Card>
    </>
  );
}
