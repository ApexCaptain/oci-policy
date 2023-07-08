import * as types from './types';

interface OciPolicyToStatementOption {
  pretty: boolean;
  tabWidth: number;
}
const defaultOciPolicyToStatementOption: OciPolicyToStatementOption = {
  pretty: true,
  tabWidth: 2,
};

interface OciPolicyConfig {
  subjectType: types.SubjectType;
  subjects: string[];
  locationType: types.LocationType;
  locationScope: string[];
  verbType: types.VerbType;
}

const defaultOciPolicyConfig: OciPolicyConfig = {
  subjectType: 'any-user',
  subjects: new Array<string>(),
  locationType: 'tenancy',
  locationScope: new Array<string>(),
  verbType: 'inspect',
};

class OciPolicy {
  private config: OciPolicyConfig;
  constructor(config?: OciPolicyConfig) {
    this.config = {
      ...defaultOciPolicyConfig,
      ...config,
    };
  }

  toStatement(
    option?: Omit<OciPolicyToStatementOption, keyof OciPolicyToStatementOption>,
  ) {
    // Options
    const { pretty, tabWidth }: OciPolicyToStatementOption = {
      ...defaultOciPolicyToStatementOption,
      ...option,
    };
    const useSubjectId = this.config.subjectType.includes('id');
    const tab = ' '.repeat(tabWidth);

    // Lines
    const subjectLine = `Allow ${this.config.subjectType.replace(' id', '')}`;
    const subjectTargetLines = this.config.subjects.map(
      (eachTarget, index) =>
        `${pretty ? tab : ''}${useSubjectId ? 'id ' : ''}${eachTarget}${
          index == this.config.subjects.length - 1 ? '' : ','
        }`,
    );
    if (subjectTargetLines.length) {
      subjectTargetLines.unshift('');
      subjectTargetLines.push('');
    }
    const verbLine = `to ${this.config.verbType}`;
    const locationLine = `in ${
      this.config.locationType
    } ${this.config.locationScope.join(':')}`;
    const finalStatementLines = [
      subjectLine,
      ...subjectTargetLines,
      verbLine,
      locationLine,
    ];
    return finalStatementLines.join(pretty ? '\n' : ' ');
  }

  // Private methods
  private clone(config: Omit<OciPolicyConfig, keyof OciPolicyConfig>) {
    return new OciPolicy({
      ...this.config,
      ...config,
    });
  }

  // Public methods
  allow(subjectType: types.SubjectType, ...subjects: string[]) {
    switch (subjectType) {
      case 'any-user':
        if (subjects.length)
          throw new Error(
            `Subject '${subjectType}' cannot have extra subjects expression.`,
          );
        break;
      default:
        if (!subjects.length)
          throw new Error(
            `Subject '${subjectType}' requires subjects expression`,
          );
        break;
    }
    return this.clone({
      subjectType,
      subjects,
    });
  }

  to(verbType: types.VerbType) {
    return this.clone({ verbType });
  }

  in(locationType: types.LocationType, ...locationScope: string[]) {
    switch (locationType) {
      case 'tenancy':
        if (locationScope.length)
          throw new Error(
            `Location '${locationType}' cannot have location scope.`,
          );
        break;
      default:
        if (!locationScope.length)
          throw new Error(
            `Location '${locationType}' requires location scope expression.`,
          );
        break;
    }
    return this.clone({
      locationType,
      locationScope,
    });
  }
}

export default new OciPolicy();
