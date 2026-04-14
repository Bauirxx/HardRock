import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import RequireRole from '../../components/auth/RequireRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Plus, Trash2, Youtube, Globe, Phone, MapPin, Clock } from 'lucide-react';

const emptyTenant = {
    nome: '', subdominio: 'default', descricao: '', logo_url: '',
    whatsapp_number: '', telefone: '', email_notificacao: '',
    endereco: '', horario_funcionamento: 'Seg-Sex 6h-22h, Sáb 8h-18h',
    google_maps_embed: '', primary_color: '#10B981',
    redes_sociais: { instagram: '', facebook: '', youtube: '', twitter: '', tiktok: '' },
    videos_youtube: [],
};

function AdminSettingsContent() {
    const [tenant, setTenant] = useState(emptyTenant);
    const [tenantId, setTenantId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [newVideo, setNewVideo] = useState({ titulo: '', url: '' });
    const { toast } = useToast();

    useEffect(() => { loadTenant(); }, []);

    const loadTenant = async () => {
        const data = await base44.entities.Tenant.list('-created_date', 1);
        if (data.length > 0) {
            const t = data[0];
            setTenantId(t.id);
            setTenant({
                ...emptyTenant, ...t,
                redes_sociais: { ...emptyTenant.redes_sociais, ...(t.redes_sociais || {}) },
                videos_youtube: t.videos_youtube || [],
            });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        if (tenantId) {
            await base44.entities.Tenant.update(tenantId, tenant);
        } else {
            const created = await base44.entities.Tenant.create({ ...tenant, subdominio: 'default' });
            setTenantId(created.id);
        }
        toast({ title: 'Configurações guardadas!' });
        setSaving(false);
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingLogo(true);
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setTenant(prev => ({ ...prev, logo_url: file_url }));
        setUploadingLogo(false);
        toast({ title: 'Logo carregado!' });
    };

    const addVideo = () => {
        if (!newVideo.url) return;
        // Extract YouTube ID if full URL
        let url = newVideo.url;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        const embedId = match ? match[1] : url;
        setTenant(prev => ({
            ...prev,
            videos_youtube: [...(prev.videos_youtube || []), { titulo: newVideo.titulo || 'Vídeo', url: embedId }]
        }));
        setNewVideo({ titulo: '', url: '' });
    };

    const removeVideo = (idx) => {
        setTenant(prev => ({ ...prev, videos_youtube: prev.videos_youtube.filter((_, i) => i !== idx) }));
    };

    if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Configurações do Ginásio</h1>
                    <p className="text-muted-foreground text-sm">Gerencie as informações institucionais</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save className="w-4 h-4" /> {saving ? 'A guardar...' : 'Guardar'}
                </Button>
            </div>

            <Tabs defaultValue="geral">
                <TabsList className="mb-6">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="contactos">Contactos</TabsTrigger>
                    <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
                    <TabsTrigger value="videos">Vídeos YouTube</TabsTrigger>
                </TabsList>

                <TabsContent value="geral">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Identidade</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Nome do Ginásio</Label>
                                    <Input value={tenant.nome} onChange={e => setTenant(p => ({ ...p, nome: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>Descrição</Label>
                                    <Textarea rows={3} value={tenant.descricao} onChange={e => setTenant(p => ({ ...p, descricao: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>Cor Principal</Label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={tenant.primary_color || '#10B981'} onChange={e => setTenant(p => ({ ...p, primary_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border" />
                                        <Input value={tenant.primary_color} onChange={e => setTenant(p => ({ ...p, primary_color: e.target.value }))} className="font-mono" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-base">Logotipo</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {tenant.logo_url && (
                                    <img src={tenant.logo_url} alt="Logo" className="w-32 h-32 object-contain rounded-lg border bg-muted" />
                                )}
                                <div>
                                    <Label>URL do Logo (ou fazer upload)</Label>
                                    <Input value={tenant.logo_url} onChange={e => setTenant(p => ({ ...p, logo_url: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div>
                                    <Label htmlFor="logo-upload" className="cursor-pointer">
                                        <Button variant="outline" className="gap-2 w-full" disabled={uploadingLogo} asChild>
                                            <span><Upload className="w-4 h-4" /> {uploadingLogo ? 'A carregar...' : 'Fazer Upload do Logo'}</span>
                                        </Button>
                                    </Label>
                                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="contactos">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Informações de Contacto</CardTitle></CardHeader>
                        <CardContent className="space-y-4 max-w-xl">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp</Label>
                                    <Input value={tenant.whatsapp_number} onChange={e => setTenant(p => ({ ...p, whatsapp_number: e.target.value }))} placeholder="+258 84 000 0000" />
                                </div>
                                <div>
                                    <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telefone</Label>
                                    <Input value={tenant.telefone} onChange={e => setTenant(p => ({ ...p, telefone: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <Label>Email de Notificações</Label>
                                <Input type="email" value={tenant.email_notificacao} onChange={e => setTenant(p => ({ ...p, email_notificacao: e.target.value }))} />
                            </div>
                            <div>
                                <Label className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Endereço</Label>
                                <Textarea rows={2} value={tenant.endereco} onChange={e => setTenant(p => ({ ...p, endereco: e.target.value }))} />
                            </div>
                            <div>
                                <Label className="flex items-center gap-1"><Clock className="w-3 h-3" /> Horário de Funcionamento</Label>
                                <Input value={tenant.horario_funcionamento} onChange={e => setTenant(p => ({ ...p, horario_funcionamento: e.target.value }))} />
                            </div>
                            <div>
                                <Label className="flex items-center gap-1"><Globe className="w-3 h-3" /> Google Maps Embed URL</Label>
                                <Input value={tenant.google_maps_embed} onChange={e => setTenant(p => ({ ...p, google_maps_embed: e.target.value }))} placeholder="https://www.google.com/maps/embed?pb=..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="redes">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Redes Sociais</CardTitle></CardHeader>
                        <CardContent className="space-y-4 max-w-xl">
                            {['instagram', 'facebook', 'youtube', 'twitter', 'tiktok'].map(rede => (
                                <div key={rede}>
                                    <Label className="capitalize">{rede}</Label>
                                    <Input
                                        value={tenant.redes_sociais?.[rede] || ''}
                                        onChange={e => setTenant(p => ({ ...p, redes_sociais: { ...p.redes_sociais, [rede]: e.target.value } }))}
                                        placeholder={`https://${rede}.com/...`}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="videos">
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Youtube className="w-5 h-5 text-red-500" /> Vídeos YouTube</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Label>Título do Vídeo</Label>
                                    <Input value={newVideo.titulo} onChange={e => setNewVideo(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Tour ao Ginásio" />
                                </div>
                                <div className="flex-1">
                                    <Label>Link YouTube</Label>
                                    <Input value={newVideo.url} onChange={e => setNewVideo(p => ({ ...p, url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
                                </div>
                                <Button onClick={addVideo} className="gap-2 shrink-0"><Plus className="w-4 h-4" /> Adicionar</Button>
                            </div>

                            {(tenant.videos_youtube || []).length === 0 ? (
                                <p className="text-center text-muted-foreground py-6">Nenhum vídeo adicionado ainda.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {tenant.videos_youtube.map((video, idx) => (
                                        <div key={idx} className="rounded-lg border overflow-hidden">
                                            <div className="aspect-video bg-black">
                                                <iframe
                                                    width="100%" height="100%"
                                                    src={`https://www.youtube.com/embed/${video.url}`}
                                                    title={video.titulo}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                            <div className="p-3 flex items-center justify-between">
                                                <p className="font-medium text-sm truncate">{video.titulo}</p>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeVideo(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function AdminSettings() {
    return (
        <RequireRole roles={['admin']}>
            <AdminSettingsContent />
        </RequireRole>
    );
}