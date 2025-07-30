"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [attendance, setAttendance] = useState<string>("no");
  const [visitDate, setVisitDate] = useState<string>("");
  const [information, setInformation] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance, visitDate, information }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Visita guardada exitosamente!'); // Success message in Spanish as per UI
      // Optionally, reset form fields here
      // setAttendance("no");
      // setVisitDate("");
      // setInformation("");
    } catch (error) {
      console.error('Error submitting visit:', error);
      alert('Error al guardar la visita. Por favor, intente de nuevo.'); // Error message in Spanish
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Visitas</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="attendance">¿Asistió?</Label>
          <Select value={attendance} onValueChange={setAttendance} name="attendance">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SI">Sí</SelectItem>
              <SelectItem value="NO">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="visitDate">Fecha de Visita</Label>
          <Input
            type="date"
            id="visitDate"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            name="visitDate"
            required
          />
        </div>

        <div>
          <Label htmlFor="information">Observaciones</Label>
          <Textarea
            id="information"
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            name="information"
            rows={4}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full">Guardar Visita</Button>
      </form>
    </div>
  );
}
