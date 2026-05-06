const stickers = ['🌸', '💖', '🐰', '✨', '🎀', '🍓'];

export default function StickerPicker({ onSelect }) {
    return (
        <div className="flex gap-2 mt-2">
            {stickers.map(s => (
                <button key={s} onClick={() => onSelect(s)} className="text-2xl">{s}</button>
            ))}
        </div>
    );
}