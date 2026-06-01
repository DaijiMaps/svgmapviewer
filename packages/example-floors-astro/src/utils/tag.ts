export type TaggedTag<
  TTag extends string | number | symbol,
  TInfo,
  Key extends keyof TInfo,
> = Extract<TInfo[Key], { tag: TTag }>['tag']

export type TaggedProps<
  TTag extends string | number | symbol,
  TInfo,
  Key extends keyof TInfo,
  K extends TaggedTag<TTag, TInfo, Key>,
> = Readonly<
  Omit<TInfo, Key> & {
    readonly [P in Key]: Extract<TInfo[Key], { tag: K }>
  }
>

export type TaggedRenderer<
  TTag extends string | number | symbol,
  TInfo,
  Key extends keyof TInfo,
  K extends TaggedTag<TTag, TInfo, Key>,
  TNode,
> = (props: TaggedProps<TTag, TInfo, Key, K>) => TNode

export type TaggedRendererMap<
  TTag extends string | number | symbol,
  TInfo,
  Key extends keyof TInfo,
  TNode,
> = {
  readonly [K in TaggedTag<TTag, TInfo, Key>]: TaggedRenderer<
    TTag,
    TInfo,
    Key,
    K,
    TNode
  >
}
