
export type Converter <Message, Source extends Record<any, any>> = (source: Source, ...args: any[]) => Message;

export function message <Message, Source extends Record<any, any>> (
    source: Source | Source[],
    converter: Converter<Message, Source>
): Message | Message[] | null {
    if (source instanceof Array) {
        return source.map((el: Source) => converter(el));
    } else {
        if (typeof source === 'undefined' || !source) return null;
        else return converter(source);
    }
}
