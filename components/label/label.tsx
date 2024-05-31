import classes from './label.module.scss';

export const Label = ({ children, className }: { children: string; className?: string }) => {
  return (
    <div className={[classes.label, className].join(' ')}>
      <p>{children}</p>
      <div className={classes.triangle}></div>
    </div>
  );
};
