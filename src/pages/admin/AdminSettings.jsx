import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import RequireRole from '../../components/auth/RequireRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Plus, Trash2, Youtube, Globe, Phone, MapPin, Clock, ExternalLink, CheckCircle, Send } from 'lucide-react';
import { setCurrentTenantId } from '@/lib/tenantStore';
import { clearSiteConfigCache } from '@/lib/useSiteConfig';

const emptyTenant = {
    nome: '', subdominio: 'default', descricao: '', logo_url: '',
    whatsapp_number: '', telefone: '', email_notificacao: '',
    endereco: '', horario_funcionamento: 'Seg-Sex 6h-22h, Sáb 8h-18h',
    google_maps_embed: '', primary_color: '#dc2626',
    horarios: [
        { dia: 'Segunda a Sexta', horas: '06:00 — 22:00' },
        { dia: 'Sábado', horas: '08:00 — 20:00' },
        { dia: 'Domingo', horas: '08:00 — 13:00' },
    ],
    redes_sociais: { instagram: '', facebook: '', youtube: '', twitter: '', tiktok: '' },
    videos_youtube: [],
    hero_images: [],
};

function AdminSettingsContent() {
    const [tenant, setTenant] = useState(emptyTenant);
    const [tenantId, setTenantId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [newVideo, setNewVideo] = useState({ titulo: '', url: '' });
    const [newSlide, setNewSlide] = useState({ url: '', titulo: '', link: '', tipo: 'geral' });
    const [uploadingSlide, setUploadingSlide] = useState(false);
    const [emailNewPassword, setEmailNewPassword] = useState('');
    const [testingEmail, setTestingEmail] = useState(false);
    const [testEmailTo, setTestEmailTo] = useState('');
    const { toast } = useToast();

    useEffect(() => { loadTenant(); }, []);

    const loadTenant = async () => {
        try {
            const data = await base44.entities.Tenant.list('-created_date', 1);
            if (data && data.length > 0) {
                const t = data[0];
                setTenantId(t.id);
                setCurrentTenantId(t.id);
                setTenant({
                    ...emptyTenant, ...t,
                    email_host: t.email_host || 'smtp.gmail.com',
                    email_port: t.email_port || 587,
                    horarios: (t.horarios && t.horarios.length > 0) ? t.horarios : emptyTenant.horarios,
                    redes_sociais: { ...emptyTenant.redes_sociais, ...(t.redes_sociais || {}) },
                    videos_youtube: t.videos_youtube || [],
                    hero_images: t.hero_images || [],
                });
            }
        } catch (e) {
            console.error('loadTenant failed:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const slug = (tenant.nome || 'gym').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'gym';
            const raw = { ...tenant, slug, subdominio: tenant.subdominio || 'default' };
            // URLFields reject empty strings — convert to null
            ['logo_url', 'google_maps_embed'].forEach(k => { if (!raw[k]) raw[k] = null; });
            // Apply SMTP defaults so get_email_configured works correctly
            if (!raw.email_host) raw.email_host = 'smtp.gmail.com';
            if (!raw.email_port) raw.email_port = 587;
            // Only send email_password if a new one was entered
            if (emailNewPassword.trim()) raw.email_password = emailNewPassword.trim();
            else delete raw.email_password;
            if (tenantId) {
                await base44.entities.Tenant.update(tenantId, raw);
                setCurrentTenantId(tenantId);
            } else {
                const created = await base44.entities.Tenant.create(raw);
                setTenantId(created.id);
                setCurrentTenantId(created.id);
            }
            setEmailNewPassword('');
            clearSiteConfigCache(); // força a landing a recarregar a config atualizada
            toast({ title: 'Configurações guardadas com sucesso!' });
            await loadTenant();
        } catch (err) {
            let msg = err.message;
            try { msg = Object.values(JSON.parse(msg)).flat().join(' '); } catch { /* keep raw */ }
            toast({ variant: 'destructive', title: 'Erro ao guardar', description: msg });
        } finally {
            setSaving(false);
        }
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
                <TabsList className="mb-6 flex-wrap h-auto gap-1">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="contactos">Contactos</TabsTrigger>
                    <TabsTrigger value="hero">Hero Slider</TabsTrigger>
                    <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
                    <TabsTrigger value="videos">Vídeos YouTube</TabsTrigger>
                    <TabsTrigger value="email">📧 Email SMTP</TabsTrigger>
                </TabsList>

                <TabsContent value="geral">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Identidade</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Nome do Ginásio</Label>
                                    <Input value={tenant.nome || ''} onChange={e => setTenant(p => ({ ...p, nome: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>Descrição</Label>
                                    <Textarea rows={3} value={tenant.descricao || ''} onChange={e => setTenant(p => ({ ...p, descricao: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>Cor Principal</Label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={tenant.primary_color || '#10B981'} onChange={e => setTenant(p => ({ ...p, primary_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border" />
                                        <Input value={tenant.primary_color || ''} onChange={e => setTenant(p => ({ ...p, primary_color: e.target.value }))} className="font-mono" />
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
                                    <Input value={tenant.logo_url || ''} onChange={e => setTenant(p => ({ ...p, logo_url: e.target.value }))} placeholder="https://..." />
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
                    <div className="space-y-6 max-w-xl">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Informações de Contacto</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp</Label>
                                        <Input value={tenant.whatsapp_number || ''} onChange={e => setTenant(p => ({ ...p, whatsapp_number: e.target.value }))} placeholder="+258 84 000 0000" />
                                    </div>
                                    <div>
                                        <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telefone</Label>
                                        <Input value={tenant.telefone || ''} onChange={e => setTenant(p => ({ ...p, telefone: e.target.value }))} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Email de Notificações</Label>
                                    <Input type="email" value={tenant.email_notificacao || ''} onChange={e => setTenant(p => ({ ...p, email_notificacao: e.target.value }))} />
                                </div>
                                <div>
                                    <Label className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Endereço (texto)</Label>
                                    <Textarea rows={2} value={tenant.endereco || ''} onChange={e => setTenant(p => ({ ...p, endereco: e.target.value }))} />
                                </div>
                                <div>
                                    <Label className="flex items-center gap-1 mb-2"><Clock className="w-3 h-3" /> Horário de Funcionamento</Label>
                                    <div className="space-y-2">
                                        {(tenant.horarios || []).map((h, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <Input
                                                    className="flex-1"
                                                    placeholder="Dia (ex: Segunda a Sexta)"
                                                    value={h.dia || ''}
                                                    onChange={e => setTenant(p => {
                                                        const hs = [...(p.horarios || [])];
                                                        hs[idx] = { ...hs[idx], dia: e.target.value };
                                                        return { ...p, horarios: hs };
                                                    })}
                                                />
                                                <Input
                                                    className="flex-1"
                                                    placeholder="Horas (ex: 06:00 — 22:00)"
                                                    value={h.horas || ''}
                                                    onChange={e => setTenant(p => {
                                                        const hs = [...(p.horarios || [])];
                                                        hs[idx] = { ...hs[idx], horas: e.target.value };
                                                        return { ...p, horarios: hs };
                                                    })}
                                                />
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0"
                                                    onClick={() => setTenant(p => ({ ...p, horarios: (p.horarios || []).filter((_, i) => i !== idx) }))}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" className="gap-2 w-full"
                                            onClick={() => setTenant(p => ({ ...p, horarios: [...(p.horarios || []), { dia: '', horas: '' }] }))}>
                                            <Plus className="w-4 h-4" /> Adicionar dia
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Localização no Mapa
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Clique no botão para abrir o OpenStreetMap, encontre o ginásio, clique com o botão direito &rarr; <strong>Show address</strong> e copie as coordenadas.
                                </p>
                                <Button
                                    variant="outline"
                                    className="gap-2 w-full"
                                    onClick={() => window.open('https://www.openstreetmap.org/', '_blank')}
                                >
                                    <ExternalLink className="w-4 h-4" /> Abrir OpenStreetMap para escolher localização
                                </Button>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Latitude</Label>
                                        <Input
                                            placeholder="-25.9659"
                                            value={tenant.latitude || ''}
                                            onChange={e => setTenant(p => ({ ...p, latitude: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Longitude</Label>
                                        <Input
                                            placeholder="32.5892"
                                            value={tenant.longitude || ''}
                                            onChange={e => setTenant(p => ({ ...p, longitude: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                {tenant.latitude && tenant.longitude && (
                                    <div className="rounded-lg overflow-hidden border h-48">
                                        <iframe
                                            title="Mapa do Ginásio"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(tenant.longitude)-0.01},${parseFloat(tenant.latitude)-0.01},${parseFloat(tenant.longitude)+0.01},${parseFloat(tenant.latitude)+0.01}&layer=mapnik&marker=${tenant.latitude},${tenant.longitude}`}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="hero">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Slides do Hero (Slider Principal)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <Label>URL da Imagem</Label>
                                    <div className="flex gap-2">
                                        <Input value={newSlide.url} onChange={e => setNewSlide(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="flex-1" />
                                        <Label htmlFor="slide-upload" className="cursor-pointer shrink-0">
                                            <Button variant="outline" className="gap-2" disabled={uploadingSlide} asChild>
                                                <span>
                                                    <Upload className="w-4 h-4" />
                                                    {uploadingSlide ? 'A carregar...' : 'Upload'}
                                                </span>
                                            </Button>
                                        </Label>
                                        <input id="slide-upload" type="file" accept="image/*" className="hidden" onChange={async e => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setUploadingSlide(true);
                                            try {
                                                const { file_url } = await base44.integrations.Core.UploadFile({ file });
                                                setNewSlide(p => ({ ...p, url: file_url }));
                                                toast({ title: 'Imagem carregada!' });
                                            } catch { toast({ variant: 'destructive', title: 'Erro ao carregar imagem' }); }
                                            finally { setUploadingSlide(false); e.target.value = ''; }
                                        }} />
                                    </div>
                                    {newSlide.url && <img src={newSlide.url} alt="preview" className="mt-2 h-24 rounded-lg object-cover border" />}
                                </div>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <div>
                                        <Label>Título</Label>
                                        <Input value={newSlide.titulo} onChange={e => setNewSlide(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Promoção Especial" />
                                    </div>
                                    <div>
                                        <Label>Link (Caminho ou URL)</Label>
                                        <Input value={newSlide.link} onChange={e => setNewSlide(p => ({ ...p, link: e.target.value }))} placeholder="/loja ou https://..." />
                                    </div>
                                    <div>
                                        <Label>Tipo</Label>
                                        <select
                                            value={newSlide.tipo}
                                            onChange={e => setNewSlide(p => ({ ...p, tipo: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-md bg-muted border-input"
                                        >
                                            <option value="nova-maquina">Nova Máquina</option>
                                            <option value="promocao">Promoção</option>
                                            <option value="geral">Geral</option>
                                        </select>
                                    </div>
                                </div>
                                <Button onClick={async () => {
                                    if (!newSlide.url) {
                                        toast({ variant: 'destructive', title: 'Insira ou faça upload de uma imagem' });
                                        return;
                                    }
                                    const slide = { ...newSlide, titulo: newSlide.titulo || 'Slide' };
                                    const updatedImages = [...(tenant.hero_images || []), slide];
                                    setTenant(prev => ({ ...prev, hero_images: updatedImages }));
                                    setNewSlide({ url: '', titulo: '', link: '', tipo: 'geral' });
                                    // Auto-save immediately
                                    setSaving(true);
                                    try {
                                        const slug = (tenant.nome || 'gym').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'gym';
                                        const raw = { ...tenant, hero_images: updatedImages, slug, subdominio: tenant.subdominio || 'default' };
                                        ['logo_url', 'google_maps_embed'].forEach(k => { if (!raw[k]) raw[k] = null; });
                                        if (tenantId) await base44.entities.Tenant.update(tenantId, raw);
                                        toast({ title: `✅ Slide adicionado e guardado! (${updatedImages.length} slides)` });
                                        await loadTenant();
                                    } catch (err) {
                                        toast({ variant: 'destructive', title: 'Slide adicionado mas erro ao guardar', description: err.message });
                                    } finally { setSaving(false); }
                                }} disabled={saving} className="gap-2 w-full"><Plus className="w-4 h-4" /> {saving ? 'A guardar...' : 'Adicionar Slide'}</Button>
                            </div>

                            {(tenant.hero_images || []).length === 0 ? (
                                <p className="text-center text-muted-foreground py-6">Nenhum slide adicionado ainda. Adicione um slide acima e clique em <strong>Guardar Slides</strong>.</p>
                            ) : (
                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Slides Adicionados ({(tenant.hero_images || []).length})</p>
                                        <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                                            <Save className="w-3 h-3" /> {saving ? 'A guardar...' : 'Guardar Slides'}
                                        </Button>
                                    </div>
                                    {tenant.hero_images.map((slide, idx) => (
                                        <div key={idx} className="border rounded-lg p-3 flex gap-3">
                                            {slide.url && (
                                                <img src={slide.url} alt={slide.titulo} className="w-24 h-24 object-cover rounded border" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{slide.titulo}</p>
                                                <p className="text-xs text-muted-foreground">{slide.link}</p>
                                                <span className="inline-block mt-1 text-xs bg-muted px-2 py-1 rounded capitalize">{slide.tipo}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={async () => {
                                                const updated = tenant.hero_images.filter((_, i) => i !== idx);
                                                setTenant(prev => ({ ...prev, hero_images: updated }));
                                                setSaving(true);
                                                try {
                                                    const slug = (tenant.nome || 'gym').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'gym';
                                                    const raw = { ...tenant, hero_images: updated, slug, subdominio: tenant.subdominio || 'default' };
                                                    ['logo_url', 'google_maps_embed'].forEach(k => { if (!raw[k]) raw[k] = null; });
                                                    if (tenantId) await base44.entities.Tenant.update(tenantId, raw);
                                                    toast({ title: 'Slide removido!' });
                                                } catch { toast({ variant: 'destructive', title: 'Erro ao remover slide' }); }
                                                finally { setSaving(false); }
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
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

                <TabsContent value="email">
                    <Card className="max-w-xl">
                        <CardHeader>
                            <CardTitle className="text-base">Configuração SMTP — Gmail</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Use a sua conta Gmail com uma <strong>App Password</strong> (senha de aplicação).
                                Gere em: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-primary underline">myaccount.google.com/apppasswords</a>
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tenant.email_configured && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                    <span>Email configurado e activo</span>
                                </div>
                            )}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Servidor SMTP</Label>
                                    <Input
                                        value={tenant.email_host || 'smtp.gmail.com'}
                                        onChange={e => setTenant(p => ({ ...p, email_host: e.target.value }))}
                                        placeholder="smtp.gmail.com"
                                    />
                                </div>
                                <div>
                                    <Label>Porta</Label>
                                    <Input
                                        type="number"
                                        value={tenant.email_port || 587}
                                        onChange={e => setTenant(p => ({ ...p, email_port: parseInt(e.target.value) || 587 }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Email Gmail (remetente)</Label>
                                <Input
                                    type="email"
                                    placeholder="arseniobaquir@gmail.com"
                                    value={tenant.email_username || ''}
                                    onChange={e => setTenant(p => ({ ...p, email_username: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>
                                    App Password {tenant.email_configured && <span className="text-xs text-muted-foreground ml-1">(deixe em branco para manter a actual)</span>}
                                </Label>
                                <Input
                                    type="password"
                                    placeholder={tenant.email_configured ? '••••••••••••••••' : 'xxxx xxxx xxxx xxxx'}
                                    value={emailNewPassword}
                                    onChange={e => setEmailNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm space-y-2">
                                <p className="font-medium">Como obter uma App Password:</p>
                                <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                                    <li>Aceda à sua Conta Google → Segurança</li>
                                    <li>Active a Verificação em 2 etapas</li>
                                    <li>Em "Senhas de aplicação", crie uma nova para "Correio"</li>
                                    <li>Cole a senha gerada (16 caracteres) aqui e guarde</li>
                                </ol>
                            </div>
                            {/* Teste de envio — sempre disponível */}
                            <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
                                <p className="text-sm font-medium">Testar envio de email</p>
                                <p className="text-xs text-muted-foreground">
                                    Guarde primeiro a configuração. Depois envie um email de teste para confirmar que tudo funciona.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Email de destino (ex: o seu email)"
                                        value={testEmailTo}
                                        onChange={e => setTestEmailTo(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        className="gap-2 shrink-0"
                                        disabled={testingEmail}
                                        onClick={async () => {
                                            setTestingEmail(true);
                                            try {
                                                const res = await base44.admin.testEmail(testEmailTo.trim() || undefined);
                                                toast({ title: 'Email de teste enviado!', description: `Enviado para ${res.sent_to}. Verifique a caixa de entrada (e Spam).` });
                                            } catch (err) {
                                                toast({ variant: 'destructive', title: 'Falha no envio', description: err.message });
                                            } finally { setTestingEmail(false); }
                                        }}
                                    >
                                        <Send className="w-4 h-4" />
                                        {testingEmail ? 'A enviar...' : 'Enviar teste'}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Após guardar, todos os emails do sistema (boas-vindas, reset de senha, convites, avisos de plano)
                                serão enviados por esta conta.
                            </p>
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