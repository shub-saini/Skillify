import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Toast = ({
  title,
  description,
  variant,
}: {
  variant: "default" | "destructive";
  title: string;
  description: string;
}) => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          variant: `${variant}`,
          title: `${title}`,
          description: `${description}`,
        });
      }}
    >
      Show Toast
    </Button>
  );
};

export default Toast;
