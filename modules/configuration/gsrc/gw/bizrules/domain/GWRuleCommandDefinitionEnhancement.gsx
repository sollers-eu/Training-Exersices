package gw.bizrules.domain

enhancement GWRuleCommandDefinitionEnhancement: RuleCommandDefinition {
  /**
   * The sequence number of this {@link RuleCommandDefinition command} within the
   * list of {@link Rule#getOrderedRuleCommandDefinitions() ordered rule commands}
   *
   * @return The sequence number of this {@link RuleCommandDefinition}
   */
  property get SequenceNumber() : Integer {
    return this.getRule().getOrderedRuleCommandDefinitions().indexOf(this) + 1 //sequence starts from 1
  }
}
