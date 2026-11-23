import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const EMPTY = { nome: '', antes: '', depois: '', tempo: '', resultado: '', ordem: 0 };

export default function AdminTransformations() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({ antes: false, depois: false });
    const { toast } = useToast();

    const handleUpload = async (field, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast({ variant: 'destructive', title: 'Ficheiro inválido', description: 'Seleciona uma imagem.' });
            return;
        }
        setUploading(u => ({ ...u, [field]: true }));
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setForm(prev => ({ ...prev, [field]: file_url }));
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro no upload', description: err.message });
        } finally {
            setUploading(u => ({ ...u, [field]: false }));
            e.target.value = '';
        }
    };

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Transformation.list('ordem', 50);
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => { setEditId(null); setForm(EMPTY); setDialogOpen(true); };
    const openEdit = (t) => {
        setEditId(t.id);
        setForm({ nome: t.nome || '', antes: t.antes || '', depois: t.depois || '', tempo: t.tempo || '', resultado: t.resultado || '', ordem: t.ordem || 0 });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.nome || !form.antes || !form.depois) {
            toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Nome, imagem antes e imagem depois são obrigatórios.' });
            return;
        }
        setSaving(true);
        try {
            const payload = { ...form, ordem: parseInt(form.ordem) || 0 };
            if (editId) {
                await base44.entities.Transformation.update(editId, payload);
                toast({ title: 'Transformação atualizada' });
            } else {
                await base44.entities.Transformation.create(payload);
                toast({ title: 'Transformação adicionada' });
            }
            setDialogOpen(false);
            setForm(EMPTY);
            setEditId(null);
            loadData();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await base44.entities.Transformation.delete(id);
            toast({ title: 'Transformação removida' });
            loadData();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Histórias de Sucesso</h1>
                    <p className="text-muted-foreground text-sm">{items.length} transformações</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={openNew}><Plus className="w-4 h-4" /> Nova</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nova'} Transformação</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Nome</Label><Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Ricardo M." /></div>
                            <div>
                                <Label>Imagem "Antes"</Label>
                                <div className="flex gap-2">
                                    <Input value={form.antes} onChange={e => setForm({ ...form, antes: e.target.value })} placeholder="Cola um URL ou carrega do PC →" />
                                    <Button type="button" variant="outline" size="icon" className="shrink-0" disabled={uploading.antes} asChild>
                                        <label className="cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload('antes', e)} />
                                        </label>
                                    </Button>
                                </div>
                                {uploading.antes && <p className="text-xs text-muted-foreground mt-1">A carregar...</p>}
                            </div>
                            <div>
                                <Label>Imagem "Depois"</Label>
                                <div className="flex gap-2">
                                    <Input value={form.depois} onChange={e => setForm({ ...form, depois: e.target.value })} placeholder="Cola um URL ou carrega do PC →" />
                                    <Button type="button" variant="outline" size="icon" className="shrink-0" disabled={uploading.depois} asChild>
                                        <label className="cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload('depois', e)} />
                                        </label>
                                    </Button>
                                </div>
                                {uploading.depois && <p className="text-xs text-muted-foreground mt-1">A carregar...</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Tempo</Label><Input value={form.tempo} onChange={e => setForm({ ...form, tempo: e.target.value })} placeholder="6 meses" /></div>
                                <div><Label>Ordem</Label><Input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: e.target.value })} /></div>
                            </div>
                            <div><Label>Resultado</Label><Textarea value={form.resultado} onChange={e => setForm({ ...form, resultado: e.target.value })} rows={2} placeholder="Perdeu 20kg e ganhou massa muscular" /></div>
                            {(form.antes || form.depois) && (
                                <div className="grid grid-cols-2 gap-2">
                                    {form.antes && <img src={form.antes} alt="antes" className="w-full h-28 object-cover rounded-lg grayscale" />}
                                    {form.depois && <img src={form.depois} alt="depois" className="w-full h-28 object-cover rounded-lg" />}
                                </div>
                            )}
                            <Button onClick={handleSave} className="w-full" disabled={saving}>{saving ? 'A guardar...' : (editId ? 'Guardar' : 'Adicionar')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-3">
                {items.map(t => (
                    <Card key={t.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex gap-1 shrink-0">
                                {t.antes && <img src={t.antes} alt="antes" className="w-14 h-14 object-cover rounded-lg grayscale" />}
                                {t.depois && <img src={t.depois} alt="depois" className="w-14 h-14 object-cover rounded-lg" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{t.nome}</span>
                                    {t.tempo && <span className="text-xs text-primary font-semibold">{t.tempo}</span>}
                                    <span className="text-xs text-muted-foreground">#{t.ordem}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{t.resultado}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ id: t.id, label: t.nome })}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {items.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">Nenhuma transformação. Adiciona a primeira.</div>
                )}
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar transformação?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que quer eliminar a transformação de <strong>{deleteTarget?.label}</strong>? Esta acção não pode ser revertida.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
