"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TestSuccessPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tests: any[]; // Replace with your TestItem[] if available
}

const TestSuccessPreviewModal = ({
  open,
  onClose,
  onConfirm,
  tests,
}: TestSuccessPreviewModalProps) => {
  const test = tests?.[0]; // Just showing first for preview; you can map multiple later

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6">
        <DialogHeader>
          <h2 className="text-green-600 text-lg font-semibold flex items-center gap-2">
            ✅ Test Created Successfully!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your new lab test has been added to the system
          </p>
        </DialogHeader>

        <Tabs defaultValue="system">
          <TabsList className="grid w-full grid-cols-3 mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="system">System Data</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created Date</p>
                <p>{new Date(test?.createdDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Modified</p>
                <p>{new Date(test?.lastModifiedDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created By</p>
                <p>{test?.createdBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Modified By</p>
                <p>{test?.lastModifiedBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Test ID</p>
                <p>#{test?.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Inclusions Count</p>
                <p>{test?.parameters?.length || 0}</p>
              </div>
            </div>

            <div className="bg-muted/40 rounded-md p-4">
              <p className="font-semibold text-sm">🩺 Associated Consultations</p>
              <p className="text-sm text-muted-foreground mt-1">
                No consultations linked to this test
              </p>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="mt-4">
            <p className="text-sm">Name: {test?.name}</p>
            <p className="text-sm">Cost: ₹{test?.cost}</p>
            <p className="text-sm">City: {test?.providerCity?.join(", ")}</p>
          </TabsContent>

          <TabsContent value="parameters" className="mt-4">
            <ul className="list-disc ml-4 text-sm">
              {test?.parameters?.map((p: any) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">
            Test successfully created with ID: <span className="font-semibold">#{test?.id}</span>
          </p>
          <Button onClick={onConfirm} className="bg-primary text-white">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestSuccessPreviewModal;
