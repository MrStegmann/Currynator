import React from 'react';

interface Step4AIInstructionsProps {
  instructions: string;
  onChange: (instructions: string) => void;
}

const Step4AIInstructions: React.FC<Step4AIInstructionsProps> = ({ instructions, onChange }) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#d3e4fe]">4. Instrucciones Específicas para la IA</h2>
      <p className="text-sm text-[#8c909f]">Si lo deseas, puedes añadir instrucciones específicas o contexto adicional que la inteligencia artificial deba tener en cuenta al reescribir tu currículum.</p>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[#8c909f] mb-2">Instrucciones a la IA (Opcional)</label>
        <textarea
          value={instructions}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-3 focus:outline-none focus:border-[#3B82F6] transition-colors resize-y text-[#d3e4fe]"
          placeholder="Ej. 'Quiero que destaques mis habilidades de liderazgo y reduzcas la información técnica irrelevante. Utiliza un tono más asertivo en las descripciones de mi experiencia anterior.'"
        />
      </div>

      <div className="bg-[#1E293B]/50 p-4 rounded-md border border-[#1E293B]">
        <h4 className="text-sm font-bold text-[#d3e4fe] mb-1">Consejos para buenas instrucciones:</h4>
        <ul className="text-sm text-[#8c909f] list-disc list-inside space-y-1">
          <li>Sé directo sobre el tono (ej. formal, moderno).</li>
          <li>Indica qué habilidades quieres que la IA destaque explícitamente.</li>
          <li>Si quieres mantener ciertas secciones intactas, díselo a la IA.</li>
        </ul>
      </div>
    </div>
  );
};

export default Step4AIInstructions;
