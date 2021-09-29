<?php
declare(strict_types=1);

namespace Savosik\RemoteFieldsBundle;
use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Pimcore\Extension\Bundle\Traits\PackageVersionTrait;


class RemoteFieldsBundle extends AbstractPimcoreBundle {

    protected function getComposerPackageName(): string
    {
        // getVersion() will use this name to read the version from
        // PackageVersions and return a normalized value
        return 'savosik/pimcore-ext';
    }

    public function getVersion()
    {
        return '1.0';
    }

    public function getDescription()
    {
        return 'To provide ajax remote select field and multiselect field';
    }

    public function getJsPaths() {
        return [
            "/bundles/remotefields/admin/js/classfields/remote-select/data.js",
            "/bundles/remotefields/admin/js/classfields/remote-select/tag.js",
            "/bundles/remotefields/admin/js/classfields/remote-multiselect/data.js",
            "/bundles/remotefields/admin/js/classfields/remote-multiselect/tag.js"
        ];
    }

}