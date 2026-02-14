'use client';

import type { TabsFieldClientComponent } from 'payload';

import { getTranslation } from '@payloadcms/translations';
import { RenderFields, useDocumentInfo, useFormFields, usePreferences, useTranslation } from '@payloadcms/ui';
import { Box, Tab, Tabs } from '@mui/material';
import { getFieldPaths } from 'payload/shared';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const TenantSettingsTabs: TabsFieldClientComponent = (props) => {
  const {
    field,
    forceRender,
    indexPath = '',
    parentPath = '',
    parentSchemaPath = '',
    path = '',
    permissions,
    readOnly,
    schemaPath = '',
  } = props;

  const tabs = useMemo(() => {
    return Array.isArray(field.tabs) ? field.tabs : [];
  }, [field.tabs]);

  const { getPreference, setPreference } = usePreferences();
  const { preferencesKey } = useDocumentInfo();
  const { i18n } = useTranslation();

  const tabStates = useFormFields(([fields]) => {
    const fieldState = (fields ?? {}) as Record<string, { passesCondition?: boolean }>;
    return tabs.map((tab, index) => {
      const id = tab?.id;
      return {
        index,
        passesCondition: id ? fieldState[id]?.passesCondition ?? true : true,
        tab,
      };
    });
  });

  const visibleTabStates = useMemo(() => {
    return tabStates.filter(({ tab, passesCondition }) => {
      return Boolean(tab?.fields?.length) && passesCondition !== false;
    });
  }, [tabStates]);

  const [activeTab, setActiveTab] = useState(() => visibleTabStates[0]?.index ?? 0);

  const tabsPrefKey = `tabs-${indexPath}`;

  const handleTabChange = useCallback(
    async (_: React.SyntheticEvent, value: number) => {
      setActiveTab(value);
      if (!preferencesKey) {
        return;
      }
      const existingPreferences = (await getPreference(preferencesKey)) as { fields?: Record<string, any> };
      const existingFields = (existingPreferences?.fields ?? {}) as Record<string, any>;
      setPreference(preferencesKey, {
        ...existingPreferences,
        ...(path
          ? {
              fields: {
                ...existingFields,
                [path]: {
                  ...(existingFields[path] || {}),
                  tabIndex: value,
                },
              },
            }
          : {
              fields: {
                ...existingFields,
                [tabsPrefKey]: {
                  ...(existingFields[tabsPrefKey] || {}),
                  tabIndex: value,
                },
              },
            }),
      });
    },
    [getPreference, path, preferencesKey, setPreference, tabsPrefKey]
  );

  useEffect(() => {
    if (activeTab > tabs.length - 1) {
      setActiveTab(visibleTabStates[0]?.index ?? 0);
    }
  }, [activeTab, tabs.length, visibleTabStates]);

  useEffect(() => {
    if (!preferencesKey) {
      return;
    }
    const getInitialPref = async () => {
      const existingPreferences = (await getPreference(preferencesKey)) as { fields?: Record<string, any> };
      const initialIndex = path
        ? existingPreferences?.fields?.[path]?.tabIndex
        : existingPreferences?.fields?.[tabsPrefKey]?.tabIndex;
      if (typeof initialIndex === 'number') {
        setActiveTab(initialIndex);
      }
    };
    getInitialPref();
  }, [getPreference, path, preferencesKey, tabsPrefKey]);

  useEffect(() => {
    if (!visibleTabStates.find(({ index }) => index === activeTab)) {
      setActiveTab(visibleTabStates[0]?.index ?? 0);
    }
  }, [activeTab, visibleTabStates]);

  if (visibleTabStates.length === 0) {
    return null;
  }

  const activeTabConfig = tabs[activeTab];
  if (!activeTabConfig) {
    return null;
  }

  const { indexPath: tabIndexPath, path: tabPath, schemaPath: tabSchemaPath } = getFieldPaths({
    field: activeTabConfig,
    index: activeTab,
    parentIndexPath: indexPath,
    parentPath,
    parentSchemaPath,
  });

  const tabPermissions = permissions as any;

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        sx={{
          borderRight: '1px solid var(--theme-elevation-150)',
          minWidth: 220,
        }}
      >
        {visibleTabStates.map(({ tab, index }) => {
          const rawLabel = tab.label && typeof tab.label !== 'function' ? tab.label : undefined;
          const label = rawLabel ? getTranslation(rawLabel as never, i18n) : undefined;
          return <Tab key={tab.id ?? `tab-${index}`} label={label ?? `Tab ${index + 1}`} value={index} />;
        })}
      </Tabs>
      <Box sx={{ flex: 1, width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <RenderFields
            fields={activeTabConfig.fields}
            forceRender={forceRender}
            parentIndexPath={tabIndexPath}
            parentPath={tabPath}
            parentSchemaPath={tabSchemaPath}
            permissions={tabPermissions}
            readOnly={readOnly}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TenantSettingsTabs;
