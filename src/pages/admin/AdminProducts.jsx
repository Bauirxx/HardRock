import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
<<<<<<< HEAD
import { Search, Plus, Package, Edit, Trash2, Upload, X, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';
import { getYouTubeId } from '@/lib/youtube';
=======
import { Search, Plus, Package, Edit, Trash2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

const emptyForm = {
    nome: '', descricao: '', preco: '', preco_promocional: '', tipo: 'supplement',
    is_machine: false, stock_quantidade: '', sku: '', status: 'active',
<<<<<<< HEAD
    sob_consulta: false, destaque: false, categoria: '', imagens: [], youtube_url: '',
=======
    sob_consulta: false, destaque: false, categoria: '', imagens: [],
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [uploadingImg, setUploadingImg] = useState(false);
    const { toast } = useToast();

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        const data = await base44.entities.Product.list('-created_date', 100);
        setProducts(data);
        setLoading(false);
    };

    const handleSave = async () => {
        const payload = {
            ...form,
            preco: parseFloat(form.preco) || 0,
            preco_promocional: form.preco_promocional ? parseFloat(form.preco_promocional) : undefined,
            stock_quantidade: parseInt(form.stock_quantidade) || 0,
            tenant_id: getCurrentTenantId() || 'default',
        };
        if (editing) {
            await base44.entities.Product.update(editing.id, payload);
            toast({ title: "Produto atualizado" });
        } else {
            await base44.entities.Product.create(payload);
            toast({ title: "Produto criado" });
        }
        setDialogOpen(false);
        setEditing(null);
        setForm(emptyForm);
        loadProducts();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImg(true);
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setForm(prev => ({ ...prev, imagens: [...(prev.imagens || []), file_url] }));
        setUploadingImg(false);
    };

    const removeImage = (idx) => {
        setForm(prev => ({ ...prev, imagens: prev.imagens.filter((_, i) => i !== idx) }));
    };

    const handleEdit = (product) => {
        setEditing(product);
        setForm({
            nome: product.nome || '', descricao: product.descricao || '',
            preco: product.preco?.toString() || '', preco_promocional: product.preco_promocional?.toString() || '',
            tipo: product.tipo || 'supplement', is_machine: product.is_machine || false,
            stock_quantidade: product.stock_quantidade?.toString() || '', sku: product.sku || '',
            status: product.status || 'active', sob_consulta: product.sob_consulta || false,
            destaque: product.destaque || false, categoria: product.categoria || '',
<<<<<<< HEAD
            imagens: product.imagens || [], youtube_url: product.youtube_url || '',
=======
            imagens: product.imagens || [],
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        await base44.entities.Product.delete(id);
        toast({ title: "Produto removido" });
        loadProducts();
    };

    const filtered = products.filter(p => p.nome?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Produtos</h1>
                    <p className="text-muted-foreground text-sm">{products.length} produtos</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm); } }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Produto</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Novo'} Produto</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Preço (MZN) *</Label><Input type="number" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} /></div>
                                <div><Label>Preço Promocional</Label><Input type="number" value={form.preco_promocional} onChange={e => setForm({ ...form, preco_promocional: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Tipo</Label>
                                    <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="supplement">Suplemento</SelectItem>
                                            <SelectItem value="clothing">Roupa</SelectItem>
                                            <SelectItem value="accessory">Acessório</SelectItem>
                                            <SelectItem value="machine">Máquina</SelectItem>
                                            <SelectItem value="equipment">Equipamento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div><Label>SKU</Label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Stock</Label><Input type="number" value={form.stock_quantidade} onChange={e => setForm({ ...form, stock_quantidade: e.target.value })} /></div>
                                <div><Label>Categoria</Label><Input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} /></div>
                            </div>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2"><Switch checked={form.is_machine} onCheckedChange={v => setForm({ ...form, is_machine: v })} /><Label>É máquina</Label></div>
                                <div className="flex items-center gap-2"><Switch checked={form.sob_consulta} onCheckedChange={v => setForm({ ...form, sob_consulta: v })} /><Label>Sob consulta</Label></div>
                                <div className="flex items-center gap-2"><Switch checked={form.destaque} onCheckedChange={v => setForm({ ...form, destaque: v })} /><Label>Destaque</Label></div>
                            </div>
                            <div>
<<<<<<< HEAD
                                <Label className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500" /> Vídeo do YouTube (opcional)</Label>
                                <Input
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={form.youtube_url}
                                    onChange={e => setForm({ ...form, youtube_url: e.target.value })}
                                />
                                {form.youtube_url && !getYouTubeId(form.youtube_url) && (
                                    <p className="text-xs text-destructive mt-1">URL do YouTube inválido.</p>
                                )}
                                {getYouTubeId(form.youtube_url) && (
                                    <p className="text-xs text-muted-foreground mt-1">Vídeo será exibido na ficha do produto.</p>
                                )}
                            </div>
                            <div>
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                <Label>Imagens do Produto</Label>
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {(form.imagens || []).map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 rounded border overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-destructive text-white rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 rounded border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                                        {uploadingImg ? <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                                    </label>
                                </div>
                            </div>

                            <Button onClick={handleSave} className="w-full">{editing ? 'Atualizar' : 'Criar'} Produto</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Procurar produtos..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square bg-muted flex items-center justify-center">
                            {product.imagens?.[0] ? (
                                <img src={product.imagens[0]} alt={product.nome} className="w-full h-full object-cover" />
                            ) : (
                                <Package className="w-12 h-12 text-muted-foreground/20" />
                            )}
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{product.tipo}</Badge>
                                {product.destaque && <Badge className="text-xs">Destaque</Badge>}
                            </div>
                            <h3 className="font-semibold text-sm truncate">{product.nome}</h3>
                            <p className="text-primary font-bold">{product.preco?.toLocaleString()} MZN</p>
                            <p className="text-xs text-muted-foreground">Stock: {product.stock_quantidade || 0}</p>
                            <div className="flex gap-1 mt-3">
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(product)}>
                                    <Edit className="w-3 h-3" /> Editar
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filtered.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum produto encontrado.</div>
                )}
            </div>
        </div>
    );
}