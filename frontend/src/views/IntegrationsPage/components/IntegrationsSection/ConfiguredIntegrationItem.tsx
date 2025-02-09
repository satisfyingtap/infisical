/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRouter } from "next/router";
import {
  faArrowRight,
  faCalendarCheck,
  faEllipsis,
  faRefresh,
  faWarning,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { integrationSlugNameMapping } from "public/data/frequentConstants";

import { ProjectPermissionCan } from "@app/components/permissions";
import { Badge, FormLabel, IconButton, Tooltip } from "@app/components/v2";
import { ProjectPermissionActions, ProjectPermissionSub } from "@app/context";
import { IntegrationMappingBehavior } from "@app/hooks/api/integrations/types";
import { TIntegration } from "@app/hooks/api/types";

type IProps = {
  integration: TIntegration;
  environments: Array<{ name: string; slug: string; id: string }>;
  onRemoveIntegration: VoidFunction;
  onManualSyncIntegration: VoidFunction;
};

export const ConfiguredIntegrationItem = ({
  integration,
  environments,
  onRemoveIntegration,
  onManualSyncIntegration
}: IProps) => {
  const router = useRouter();

  return (
    <div
      className="max-w-8xl flex cursor-pointer justify-between rounded-md border border-mineshaft-600 bg-mineshaft-800 p-3 transition-all hover:bg-mineshaft-700"
      onClick={() => router.push(`/integrations/details/${integration.id}`)}
      key={`integration-${integration?.id.toString()}`}
    >
      <div className="flex">
        <div className="ml-2 flex flex-col">
          <FormLabel label="Environment" />
          <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
            {environments.find((e) => e.id === integration.envId)?.name || "-"}
          </div>
        </div>
        <div className="ml-2 flex flex-col">
          <FormLabel label="Secret Path" />
          <div className="min-w-[8rem] rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
            {integration.secretPath}
          </div>
        </div>
        <div className="mt-3 flex h-full items-center">
          <FontAwesomeIcon icon={faArrowRight} className="mx-4 text-gray-400" />
        </div>
        <div className="ml-4 flex flex-col">
          <FormLabel
            tooltipText={
              integration.integration === "github" ? (
                <div className="text-xs">
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {integration.metadata?.githubVisibility === "selected"
                    ? "Syncing to selected repositories in the organization. "
                    : integration.metadata?.githubVisibility === "private"
                    ? "Syncing to all private repositories in the organization"
                    : "Syncing to all public and private repositories in the organization"}
                </div>
              ) : undefined
            }
            label="Integration"
          />
          <div className="min-w-[8rem] rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
            {integrationSlugNameMapping[integration.integration]}
          </div>
        </div>
        {integration.integration === "qovery" && (
          <div className="flex flex-row">
            <div className="ml-2 flex flex-col">
              <FormLabel label="Org" />
              <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
                {integration?.owner || "-"}
              </div>
            </div>
            <div className="ml-2 flex flex-col">
              <FormLabel label="Project" />
              <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
                {integration?.targetService || "-"}
              </div>
            </div>
            <div className="ml-2 flex flex-col">
              <FormLabel label="Env" />
              <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
                {integration?.targetEnvironment || "-"}
              </div>
            </div>
          </div>
        )}
        {!(
          integration.integration === "aws-secret-manager" &&
          integration.metadata?.mappingBehavior === IntegrationMappingBehavior.ONE_TO_ONE
        ) && (
          <div className="ml-2 flex flex-col">
            <FormLabel
              label={
                (integration.integration === "qovery" && integration?.scope) ||
                (integration.integration === "circleci" && "Project") ||
                (integration.integration === "bitbucket" && "Repository") ||
                (integration.integration === "aws-secret-manager" && "Secret") ||
                (["aws-parameter-store", "rundeck"].includes(integration.integration) && "Path") ||
                (integration?.integration === "terraform-cloud" && "Project") ||
                (integration?.scope === "github-org" && "Organization") ||
                (["github-repo", "github-env"].includes(integration?.scope as string) &&
                  "Repository") ||
                "App"
              }
            />
            <div className="no-scrollbar::-webkit-scrollbar min-w-[8rem] max-w-[12rem] overflow-scroll whitespace-nowrap rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200 no-scrollbar">
              {(integration.integration === "hashicorp-vault" &&
                `${integration.app} - path: ${integration.path}`) ||
                (integration.scope === "github-org" && `${integration.owner}`) ||
                (["aws-parameter-store", "rundeck"].includes(integration.integration) &&
                  `${integration.path}`) ||
                (integration.scope?.startsWith("github-") &&
                  `${integration.owner}/${integration.app}`) ||
                integration.app}
            </div>
          </div>
        )}
        {(integration.integration === "vercel" ||
          integration.integration === "netlify" ||
          integration.integration === "railway" ||
          integration.integration === "gitlab" ||
          integration.integration === "teamcity" ||
          (integration.integration === "github" && integration.scope === "github-env")) && (
          <div className="ml-4 flex flex-col">
            <FormLabel label="Target Environment" />
            <div className="overflow-clip text-ellipsis whitespace-nowrap rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
              {integration.targetEnvironment || integration.targetEnvironmentId}
            </div>
          </div>
        )}
        {integration.integration === "bitbucket" && (
          <>
            {integration.targetServiceId && (
              <div className="ml-2 flex flex-col">
                <FormLabel label="Environment" />
                <div className="min-w-[8rem] overflow-clip text-ellipsis whitespace-nowrap rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
                  {integration.targetService || integration.targetServiceId}
                </div>
              </div>
            )}
            <div className="ml-2 flex flex-col">
              <FormLabel label="Workspace" />
              <div className="overflow-clip text-ellipsis whitespace-nowrap rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
                {integration.targetEnvironment || integration.targetEnvironmentId}
              </div>
            </div>
          </>
        )}
        {integration.integration === "checkly" && integration.targetService && (
          <div className="ml-2">
            <FormLabel label="Group" />
            <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
              {integration.targetService}
            </div>
          </div>
        )}
        {integration.integration === "circleci" && integration.owner && (
          <div className="ml-2">
            <FormLabel label="Organization" />
            <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
              {integration.owner}
            </div>
          </div>
        )}
        {integration.integration === "terraform-cloud" && integration.targetService && (
          <div className="ml-2">
            <FormLabel label="Category" />
            <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
              {integration.targetService}
            </div>
          </div>
        )}
        {(integration.integration === "checkly" || integration.integration === "github") && (
          <div className="ml-2">
            <FormLabel label="Secret Suffix" />
            <div className="rounded-md border border-mineshaft-700 bg-mineshaft-900 px-3 py-2 font-inter text-sm text-bunker-200">
              {integration?.metadata?.secretSuffix || "-"}
            </div>
          </div>
        )}
      </div>
      <div className="mt-[1.5rem] flex cursor-default space-x-3">
        {integration.isSynced != null && integration.lastUsed != null && (
          <Badge variant={integration.isSynced ? "success" : "danger"} key={integration.id}>
            <Tooltip
              center
              className="max-w-xs whitespace-normal break-words"
              content={
                <div className="flex max-h-[10rem] flex-col overflow-auto ">
                  <div className="flex self-start">
                    <FontAwesomeIcon icon={faCalendarCheck} className="pt-0.5 pr-2 text-sm" />
                    <div className="text-sm">Last successful sync</div>
                  </div>
                  <div className="pl-5 text-left text-xs">
                    {format(new Date(integration.lastUsed), "yyyy-MM-dd, hh:mm aaa")}
                  </div>
                  {!integration.isSynced && (
                    <>
                      <div className="mt-2 flex self-start">
                        <FontAwesomeIcon icon={faXmark} className="pt-1 pr-2 text-sm" />
                        <div className="text-sm">Fail reason</div>
                      </div>
                      <div className="pl-5 text-left text-xs">{integration.syncMessage}</div>
                    </>
                  )}
                </div>
              }
            >
              <div className="flex h-full items-center space-x-2">
                <div>{integration.isSynced ? "Synced" : "Not synced"}</div>
                {!integration.isSynced && <FontAwesomeIcon icon={faWarning} />}
              </div>
            </Tooltip>
          </Badge>
        )}
        <div className="space-x-1.5">
          <Tooltip className="text-center" content="Manually sync integration secrets">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onManualSyncIntegration();
              }}
              ariaLabel="sync"
              colorSchema="primary"
              variant="star"
              className="max-w-[2.5rem] border-none bg-mineshaft-500"
            >
              <FontAwesomeIcon icon={faRefresh} className="px-1" />
            </IconButton>
          </Tooltip>
          <ProjectPermissionCan
            I={ProjectPermissionActions.Delete}
            a={ProjectPermissionSub.Integrations}
          >
            {(isAllowed: boolean) => (
              <Tooltip content="Remove Integration">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveIntegration();
                  }}
                  ariaLabel="delete"
                  isDisabled={!isAllowed}
                  colorSchema="danger"
                  variant="star"
                  className="max-w-[2.5rem] border-none bg-mineshaft-500"
                >
                  <FontAwesomeIcon icon={faXmark} className="px-1" />
                </IconButton>
              </Tooltip>
            )}
          </ProjectPermissionCan>

          <Tooltip content="View details">
            <IconButton
              ariaLabel="delete"
              colorSchema="primary"
              variant="star"
              className="max-w-[2.5rem] border-none bg-mineshaft-500"
            >
              <FontAwesomeIcon icon={faEllipsis} className="px-1" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
