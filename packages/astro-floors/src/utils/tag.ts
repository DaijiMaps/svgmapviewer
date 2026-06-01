export type TaggedTag<TInfo, Key extends keyof TInfo> = Extract<
  TInfo[Key],
  { tag: string | number | symbol }
>['tag']

export type TaggedProps<
  TInfo,
  Key extends keyof TInfo,
  K extends TaggedTag<TInfo, Key>,
> = Readonly<
  Omit<TInfo, Key> & {
    readonly [P in Key]: Extract<TInfo[Key], { tag: K }>
  }
>

export type TaggedRenderer<
  TInfo,
  Key extends keyof TInfo,
  K extends TaggedTag<TInfo, Key>,
  TNode,
> = (props: TaggedProps<TInfo, Key, K>) => TNode

export type TaggedRendererMap<TInfo, Key extends keyof TInfo, TNode> = {
  readonly [K in TaggedTag<TInfo, Key>]: TaggedRenderer<TInfo, Key, K, TNode>
}
