import { Subject, Verb, Location } from './types';

class OciPolicy {
  private subject: Subject = 'any-user';
  private subjectTargets = new Array<string>();
  private verb: Verb = 'inspect';
  private resourceType: string = 'all-resources';
  private location: Location = 'tenancy';
  private locationTargets = new Array<string>();

  // Private Methods
  private get clone() {
    const clonedOciPolicy = new OciPolicy();

    // Cloning
    clonedOciPolicy.subject = this.subject;
    clonedOciPolicy.subjectTargets = this.subjectTargets;
    clonedOciPolicy.verb = this.verb;
    clonedOciPolicy.resourceType = this.resourceType;
    clonedOciPolicy.location = this.location;
    clonedOciPolicy.locationTargets = this.locationTargets;

    return clonedOciPolicy;
  }

  build() {
    // Input options
    const pretty = true;
    const tabWidth = 2;

    // Options
    const useSubjectId = this.subject.includes('id');
    const tab = ' '.repeat(tabWidth);

    // Lines
    const subjectLine = `Allow ${this.subject.replace(' id', '')}`;

    const subjectTargetLines = this.subjectTargets.map(
      (eachTarget, index) =>
        `${pretty ? tab : ''}${useSubjectId ? 'id ' : ''}${eachTarget}${
          index == this.subjectTargets.length - 1 ? '' : ','
        }`,
    );
    if (subjectTargetLines.length) {
      subjectTargetLines.unshift('');
      subjectTargetLines.push('');
    }

    const verbLine = `to ${this.verb} ${this.resourceType}`;

    const locationLine = `in ${this.location} ${this.locationTargets.join(
      ':',
    )}`;

    const finalStatementLines = [
      subjectLine,
      ...subjectTargetLines,
      verbLine,
      locationLine,
    ];

    return finalStatementLines.join(pretty ? '\n' : ' ');
    /*
      return `
    Allow

    ${
      subject == 'any-user'
        ? subject
        : `${subject.type} \n\t${subject.targets.join(', \n\t')}`
    }

    to ${verb} ${resourceType}

    in ${
      location == 'tenancy'
        ? location
        : `${location.type} ${location.expression}`
    }

    ${condition ? `where ${condition}` : ''}
    `.trim();
    */
  }

  // Methods
  allow(subject: Subject, ...targets: string[]) {
    switch (subject) {
      case 'any-user':
        if (targets.length)
          throw new Error(`Subject '${subject}' cannot have targets.`);
        break;
      default:
        if (!targets.length)
          throw new Error(
            `Subject '${subject}' should contain at least 1 target.`,
          );
        break;
    }

    const ociPolicy = this.clone;
    ociPolicy.subject = subject;
    ociPolicy.subjectTargets = targets;
    return ociPolicy;
  }

  to(verb: Verb, resourceType: string) {
    const ociPolicy = this.clone;
    ociPolicy.verb = verb;
    ociPolicy.resourceType = resourceType;
    return ociPolicy;
  }

  in(location: Location, ...targets: string[]) {
    switch (location) {
      case 'tenancy':
        if (targets.length)
          throw new Error(`Location '${location}' cannot have targets.`);
        break;
      default:
        if (!targets.length)
          throw new Error(
            `Location '${location}' should contain at least 1 target`,
          );
        break;
    }

    const ociPolicy = this.clone;
    ociPolicy.location = location;
    ociPolicy.locationTargets = targets;
    return ociPolicy;
  }
}
export default new OciPolicy();
/*
export const generateOciPolicyStatement = (option: {
  subject:
    | 'any-user'
    | {
        type: 'group' | 'group id' | 'dynamic-group' | 'dynamic-group id';
        targets: string[];
      };

  verb: 'inspect' | 'read' | 'use' | 'manage';
  resourceType: string;
  location:
    | 'tenancy'
    | {
        type: 'compartment' | 'compartment id';
        expression: string;
      };
  condition?: string;
}) => {
  const { subject, verb, resourceType, location, condition } = option;
  return `
    Allow

    ${
      subject == 'any-user'
        ? subject
        : `${subject.type} \n\t${subject.targets.join(', \n\t')}`
    }

    to ${verb} ${resourceType}

    in ${
      location == 'tenancy'
        ? location
        : `${location.type} ${location.expression}`
    }

    ${condition ? `where ${condition}` : ''}
    `.trim();
};
*/
