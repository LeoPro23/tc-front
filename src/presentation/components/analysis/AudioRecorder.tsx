import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Send, Loader2 } from 'lucide-react';
import { managementApi } from '@/lib/api/management.service';

interface AudioRecorderProps {
  analysisId: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ analysisId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSuccessMessage(null);
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      alert('No se pudo acceder al micrófono. Por favor revise los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Detener las pistas para liberar el micrófono
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
  };

  const sendRecording = async () => {
    if (!audioBlob) return;
    
    setIsSending(true);
    setSuccessMessage(null);
    try {
      const response = await managementApi.uploadAnalysisComment(analysisId, audioBlob);
      setSuccessMessage(response.message || 'Listo, se enviarán los resultados a su WhatsApp.');
      discardRecording();
    } catch (error) {
      console.error('Error enviando comentario de audio:', error);
      alert('Ocurrió un error al enviar el audio. Intente nuevamente.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
      <h3 className="text-sm font-black tracking-tighter italic text-gray-900 dark:text-white uppercase">
        Incluir Comentarios Adicionales
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        ¿Notas algo más en el campo? Graba un mensaje de voz y nuestra IA de OpenRouter re-evaluará el análisis y te enviará las actualizaciones por WhatsApp.
      </p>

      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm font-medium">
          {successMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            <Mic className="w-4 h-4" />
            Empezar a grabar
          </button>
        )}

        {isRecording && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              Grabando...
            </div>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              <Square className="w-4 h-4" />
              Detener
            </button>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="flex flex-col sm:flex-row w-full sm:items-center gap-3 bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/10">
            <audio src={audioUrl} controls className="h-10 outline-none w-full sm:w-auto flex-1 max-w-[250px]" />
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={discardRecording}
                disabled={isSending}
                className="flex items-center justify-center p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                title="Descartar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={sendRecording}
                disabled={isSending}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-70"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
