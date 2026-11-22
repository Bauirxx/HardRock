import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import WhatsAppButton from '../components/landing/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Dumbbell, MessageCircle, Info, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function EquipmentPage() {
    const cfg = useSiteConfig();
    const waNumero = (cfg.whatsapp_number || cfg.telefone || '').replace(/[^0-9]/g, '');
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadEquipment = () => {
        setLoading(true);
        setError(null);
        base44.entities.Product.list('-created_date', 100)
            .then(all => {
                const machines = (Array.isArray(all) ? all : []).filter(p =>
                    p.is_machine ||
                    p.tipo === 'machine' ||
                    p.tipo === 'equipment'
                );
                setEquipment(machines);
            })
            .catch(err => setError(err.message || 'Erro de ligação'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadEquipment(); }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-space font-bold mb-2">Equipamentos & Máquinas</h1>
                        <p className="text-muted-foreground">Conheça o nosso catálogo de equipamento profissional de fitness.</p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-24">
                            <Dumbbell className="w-16 h-16 text-destructive/40 mx-auto mb-4" />
                            <h3 className="font-space font-semibold text-lg mb-2">Erro ao carregar</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Button onClick={loadEquipment}>Tentar novamente</Button>
                        </div>
                    ) : equipment.length === 0 ? (
                        <div className="text-center py-24">
                            <Dumbbell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="font-space font-semibold text-lg mb-2">Sem equipamentos registados</h3>
                            <p className="text-muted-foreground">Ainda não há equipamentos cadastrados com tipo "Máquina" ou "Equipamento".</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {equipment.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                                        <div className="aspect-square relative overflow-hidden bg-muted">
                                            {item.imagens?.[0] ? (
                                                <img src={item.imagens[0]} alt={item.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : getYouTubeThumbnail(item.youtube_url) ? (
                                                <img src={getYouTubeThumbnail(item.youtube_url)} alt={item.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Dumbbell className="w-16 h-16 text-muted-foreground/20" />
                                                </div>
                                            )}
                                            {item.sob_consulta && (
                                                <Badge variant="secondary" className="absolute top-3 right-3">Sob Consulta</Badge>
                                            )}
                                            {getYouTubeEmbedUrl(item.youtube_url) && (
                                                <Badge className="absolute top-3 left-3 gap-1 bg-red-600 hover:bg-red-700">
                                                    <PlayCircle className="w-3 h-3" /> Vídeo
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-space font-semibold text-lg mb-1">{item.nome}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.descricao}</p>

                                            {item.sob_consulta ? (
                                                <p className="text-primary font-bold mb-4">Preço sob consulta</p>
                                            ) : (
                                                <p className="text-xl font-bold mb-4">{item.preco?.toLocaleString()} MZN</p>
                                            )}

                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                                                            <Info className="w-4 h-4" /> Ficha Técnica
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>{item.nome}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-3">
                                                            {getYouTubeEmbedUrl(item.youtube_url) && (
                                                                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                                                    <iframe
                                                                        src={getYouTubeEmbedUrl(item.youtube_url)}
                                                                        title={item.nome}
                                                                        className="w-full h-full"
                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                        allowFullScreen
                                                                    />
                                                                </div>
                                                            )}
                                                            {item.descricao && <p className="text-muted-foreground">{item.descricao}</p>}
                                                            {item.ficha_tecnica && Object.keys(item.ficha_tecnica).length > 0 && (
                                                                <div className="space-y-2">
                                                                    <Separator />
                                                                    {Object.entries(item.ficha_tecnica).filter(([_, v]) => v).map(([key, val]) => (
                                                                        <div key={key} className="flex justify-between py-2 border-b text-sm">
                                                                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                                                                            <span className="font-medium">{val}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                {waNumero && (
                                                    <a href={`https://wa.me/${waNumero}?text=${encodeURIComponent(`Olá! Tenho interesse no equipamento: ${item.nome}`)}`} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" className="gap-1">
                                                            <MessageCircle className="w-4 h-4" /> Contactar
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}