import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function AvatarPicker({ user, onChange }) {
    return (
        <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
                <AvatarImage src={user?.foto_url} />
                <AvatarFallback>
                    <User className="w-6 h-6" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">{user?.full_name || 'Utilizador'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
        </div>
    );
}
