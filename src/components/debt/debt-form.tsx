import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DebtFormData } from "@/data/types/debt";

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000];

interface DebtFormProps {
  onSubmit: (data: DebtFormData) => void;
}

export default function DebtForm({ onSubmit }: DebtFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onSubmit({
      name,
      amount: parseInt(amount),
      note: note || undefined,
    });

    // Reset form
    setName("");
    setAmount("");
    setNote("");
  };

  const marginClass = "my-2";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Hutang Baru </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className={marginClass} htmlFor="name">
              Nama Pelanggan
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi"
              required
            />
          </div>

          <div>
            <Label className={marginClass} htmlFor="amount">
              Nominal Hutang (Rp)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
              >
                {amt.toLocaleString("id-ID")}
              </Button>
            ))}
          </div>

          <div>
            <Label className={marginClass} htmlFor="note">
              Catatan (opsional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hutang mie ayam + es teh..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full">
            Simpan Hutang
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
