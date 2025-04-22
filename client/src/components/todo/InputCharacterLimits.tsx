const InputCharacterLimits = ({ todoContent }: { todoContent: string }) => {
  return (
    <div className={`ml-3 ${charactersLimitsColor(todoContent.length)}`}>
      {todoContent.length} / 200
    </div>
  );
};

export default InputCharacterLimits;

const charactersLimitsColor = (todoLength: number) => {
  if (todoLength === 200) {
    return "text-red-500";
  } else if (todoLength > 100 && todoLength < 150) {
    return "text-amber-600";
  } else if (todoLength > 150 && todoLength < 200) {
    return "text-amber-800";
  } else {
    return "text-muted-foreground";
  }
};
