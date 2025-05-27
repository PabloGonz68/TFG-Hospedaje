import { Calendar } from "@/components/ui/calendar";
import * as React from "react";

interface ReservaCalendarProps {
    label: string;
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
}

const ReservaCalendar: React.FC<ReservaCalendarProps> = ({ label, selected, onSelect }) => {
    return (
        <div className="flex flex-col items-start">
            <label className="mb-2 font-medium">{label}</label>
            <Calendar
                mode="single"
                selected={selected}
                onSelect={onSelect}
                className="rounded-md border shadow"
            />
        </div>
    );
};

export default ReservaCalendar;
