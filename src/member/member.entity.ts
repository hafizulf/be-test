export interface IMember {
  code: string;
  name: string;
}

export class MemberEntity  {
  props: IMember;

  constructor(props: IMember) {
    this.props = props;
  }

  static create(props: IMember): MemberEntity {
    return new MemberEntity(props);
  }

  public unmarshal(): IMember {
    return {
      code: this.code,
      name: this.name
    }
  }

  public get code(): string {
    return this.props.code;
  }

  public get name(): string {
    return this.props.name;
  }
}
